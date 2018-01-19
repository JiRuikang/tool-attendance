<template>
  <div class="entry" ref = "entryAdaptive" >
    <section v-if="triggerState.entry == true">
      <div class="cin">
        <importFile @listenImportEvent = "getImportData"></importFile>
        <textarea class="paste" cols="20" v-model = "dataOriginal"></textarea>
      </div>
      <input type="button" name="test" @click = 'setPivot'  value="分析">
      <input type="button" name="test" @click = 'setReset' value="重置">
    </section>
    <section v-if="triggerState.entry == false" @click = "showEntry($event)">
      <input type="button"   value="显示输入框">
    </section>
  </div>
</template>

<script>
  import UcarDate from 'ucar-date';
  import ImportFile from '@/components/ImportFile';
  export default {
    name: 'app',
    props: ['triggerState'],
    components: {
      'importFile': ImportFile
    },
    data () {
      return {
//        原始数据：excel或者用户粘贴
        dataOriginal: '',
//        透视数据：用于透视模块，打印模块的数据展示
        dataPivot: [],
//        中间数据：数据已经经过透视，但未归并同一人的打卡记录，不适合展示
        dataMiddle: [],
//        主键ID（员工id）
        idList: [],
//        主键描述（姓名+部门+工号等）
        memberList: [],
//        月份
        dateMonth: ''
      };
    },
    methods: {
      setReset: function () {
        this.dataOriginal = '';
        this.dataPivot = [];
        this.memberList = [];
        this.dataMiddle = [];
        this.$emit('listenChildEvent', this.dataPivot);
      },
      setPivot: function () {
        var self = this;
        var str = self.dataOriginal;
        var entryArray;
        if (!str) {
          return false;
        };
//        去掉星期x,去掉"正常"，"异常"
        str = str.replace(/星期[\u4e00-\u9fa5]{1}/g, '').replace(/正常/g, '').replace(/异常/g, '');
//        统一日期连接符
        str = str.replace(/\//g, '-');
        entryArray = str.split('\n').filter(function (item, index) {
          return item.trim() !== '';
        });
//        初始化月份
        var thisDate = entryArray[0].match(/[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/g)[0];
        if (thisDate) {
          self.dateMonth = new UcarDate(new Date(thisDate));
        } else {
          self.dateMonth = new UcarDate();
        }
        self.dataPivot = [];
        self.memberList = [];
        self.dataMiddle = [];
//        初始化中间数据
        self.getMiddleData(entryArray);
//        初始化透视数据
        self.getPivotData();
        self.$emit('listenChildEvent', this.dataPivot);
      },
      getImportData: function (data) {
        var self = this;
        self.dataOriginal = data;
        this.dataPivot = [];
        this.memberList = [];
        this.dataMiddle = [];
        self.setPivot();
      },
      getPivotData: function () {
        var self = this;
        self.idList.forEach(function (item, index, array) {
          var getDayListData = self.getDayList();
          var weekendlist = getDayListData.weekendlist;
          var workday = getDayListData.workday;
          var obj = {};
          obj.name = self.memberList[index];
          obj.show = false;
          obj.list = self.dataMiddle.filter(function (item2) {
            return item2.id === item;
          });
          obj.list.forEach(function (item3, index, array) {
            if (weekendlist.indexOf(item3.date) >= 0) {
              item3.state = 5;
            }
            self.arrayRemove(workday.indexOf(item3.date), workday);
          });
          if (workday.length > 0) {
            workday.forEach(function (item4, index, array) {
              var absenceObj = {
                'des': obj.name,
                'date': item4,
                'state': 2,
                'time': '无打卡记录'
              };
              obj.list.push(absenceObj);
            });
          }
          self.dataPivot.push(obj);
        });
        self.dataPivot[0].show = true;
      },
      getMiddleData: function (entryArray) {
        var self = this;
        entryArray.forEach(function (item, index, array) {
//        逐行解析，提取每行的描述、日期、打卡时间、打卡有效性
          if (!item) {
            return false;
          }
          var itemObj = {};
//         工号
          var id = item.match(/\s(\d)+\s/g);
          if (id) {
            itemObj.id = id[0].trim();
          } else {
            itemObj.id = 100000000000;
          }
//         中文描述
          itemObj.des = self.strDec(item.trim()) + '/' + itemObj.id;
//         初始化主键
          if (self.idList.indexOf(itemObj.id) < 0) {
            self.idList.push(itemObj.id);
            self.memberList.push(itemObj.des);
          }
//         打卡日期
          var date = item.match(/[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/g);
          if (date) {
            itemObj.date = date[0];
          } else {
            itemObj.date = '第' + (index + 1) + '条异常';
            itemObj.state = 3;
          }
//         打卡时间、打卡有效性
          var time = item.match(/[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}/g);
          var timeDiffer = self.strTime(time);
          if (timeDiffer === false || timeDiffer.state === 3) {
//            重写itemObj.date为异常数据
            itemObj.date = '第' + (index + 1) + '条异常';
            itemObj.state = 3;
          } else {
            itemObj.time = timeDiffer.timeFormat;
            itemObj.state = timeDiffer.state;
          }
          self.dataMiddle.push(itemObj);
        });
      },
      strDec: function (str) {
        // 提取str中的中文字段，返回字段数组
        var allcStr = str.replace(/[^\u4e00-\u9fa5]/gi, '');
        var _src = str;
        var arrayStart = [];
        var arrayEnd = [];
        var cArray = [];
        if (!allcStr) {
          return '匿名某';
        }
        var indexcArray = allcStr.split('').map(function (item, index) {
          var i = _src.indexOf(item);
          var a = _src.split('');
          a[i] = '*';
          _src = a.join('');
          return i;
        });
        arrayStart.push(indexcArray[0]);
        indexcArray.forEach(function (item, index, array) {
          if (item + 1 !== array[index + 1]) {
            array[index + 1] ? arrayStart.push(array[index + 1]) : '';
            arrayEnd.push(item);
          }
        });
        arrayStart.forEach(function (item, index, array) {
          cArray.push(str.substring(item, arrayEnd[index] + 1));
        });
        //         中文描述
        if (cArray) {
          return cArray.sort(function (a, b) {
//              按字段长度排序
            return a.length > b.length;
          }).join('/');
        } else {
          return '匿名某';
        }
      },
      strTime: function (time1, time2) {
        var start;
        var end;
        var state;
        var timeFormat;
        if (time1 && typeof (time1) === 'object' && time1.length === 2) {
          start = time1[0].split(':');
          end = time1[1].split(':');
          timeFormat = time1[0] + '-' + time1[1];
        } else {
          return false;
        }
        var startTime = {
          'h': parseInt(start[0]),
          'm': parseInt(start[1]),
          's': parseInt(start[2])
        };
        var endTime = {
          'h': parseInt(end[0]),
          'm': parseInt(end[1]),
          's': parseInt(end[2].split(']')[0])
        };
        var starttime = startTime.h * 60 * 60 + startTime.m * 60 + startTime.s;
        var endtime = endTime.h * 60 * 60 + endTime.m * 60 + endTime.s;
        if (starttime > endtime) {
          var middleTime = startTime;
          startTime = endTime;
          endTime = middleTime;
          timeFormat = timeFormat.match(/-/g)[1] + '-' + timeFormat.match(/-/g)[0];
        }
        if (startTime.h - 10 < 0 && (endTime.h - 17 > 0 || (endTime.h - 17 === 0 && endTime.m - 30 > 0)) && endtime - starttime >= 32400) {
//          正常打卡
          state = 4;
        } else if (startTime.h - 10 >= 0 && (startTime.h - 13 < 0 || (startTime.h - 13 === 0 && startTime.m <= 30)) && (endTime.h - 17 > 0 || (endTime.h - 17 === 0 && endTime.m - 30 > 0))) {
//          迟到（上午缺勤）：首次打卡时间大于10:00，小于13:30，末次打卡时间大于17:30
          state = 0;
        } else if (startTime.h - 10 < 0 && endtime - starttime >= 14400 && endtime - starttime < 32400) {
//          早退（下午缺勤）：首次打卡时间小于10:00，首末次打卡间距大于4小时，小于9小时
          state = 1;
        } else {
//          缺勤
          state = 2;
        }
        return {
          'state': state,
          'timeFormat': timeFormat
        };
      },
      arrayRemove: function (dx, array) {
        if (isNaN(dx) || dx > array.length || dx < 0) {
          return false;
        }
        for (var i = 0, n = 0; i < array.length; i++) {
          if (array[i] !== array[dx]) {
            array[n++] = array[i];
          }
        }
        if (array.length > 0) {
          array.length -= 1;
        }
      },
      getDayList: function () {
        var weekendlist = [];
        var workday = [];
        this.dateMonth.getAllOfMonth().forEach(function (dateitem) {
          if (dateitem.day === 6 || dateitem.day === 7) {
            weekendlist.push(dateitem.dateStr);
          } else {
            workday.push(dateitem.dateStr);
          }
        });
        return {
          'weekendlist': weekendlist,
          'workday': workday
        };
      },
      showEntry: function () {
        this.$props.triggerState.entry = true;
      }
    },
    watch: {
      'dataOriginal' (newval, oldval) {
        if (typeof (oldval) !== 'undefined' && oldval !== '') {
          this.setPivot();
        }
      }
    }
  };
</script>

<style scoped>
  .cin{
    width: 90%;
    height: 300px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    padding: 20px 20px 0 20px;
  }
  .entry {
    width: 75%;
    height: auto;
    background-color: #FFF;
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }
  .paste {
    height: 300px;
    width: 45%;
    display: inline-block;
  }
  input{
    margin: 20px;
    width: 140px;
    height: 40px;
    background: #fff;
    border-radius: 3px;
    letter-spacing: 2px;
    font-size: 20px;
    border: 1px solid #339933;
    color: #339933;
    outline: none;
  }
  input:hover{
    background: #339933;
    color: #fff;
  }
</style>
