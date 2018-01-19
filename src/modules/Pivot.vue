<template>
  <div class="pivot" >
    <div v-if="triggerState.searchbox == true">
      <input type="text" class="searchinput" v-model = "searchData" @keyup.13="search">
      <input type="button" value="搜索" class="searchbtn" @click="search">
    </div>
    <ul class="personlist">
      <li  v-for = "item in dataPivot"  class="person" :title="item.name"  @click = 'switchPerson(item.name)' slot="personList">
          <span class="personShow" v-if = "item.show == true">
            {{item.name}}
          </span>
          <span  v-if = "item.show == false">
            {{item.name}}
          </span>
      </li>
    </ul>
    <section class="winPivot"  v-for = "datalist in dataPivot" v-if = "datalist.show == true">
      <classifyData  v-for="(val, key, index) in classifyEnum" :datalist = "datalist.list" :class="key" :index = "index" :key = "index" :triggerState = "triggerState">
        <span class="winPivotSpan" slot="comLate">{{val + ':'}}</span>
      </classifyData>
    </section>
  </div>
</template>

<script>
  import ClassifyData from '@/components/ClassifyData';

  export default {
    name: 'pivot',
    data () {
      return {
        classifyEnum: {
//          0:迟到，1：早退，2：缺勤，3：数据异常，4：正常,5:加班
          'comeLate': '迟到(上午缺勤)',
          'leaveEarly': '早退(下午缺勤)',
          'absenteeism': '缺勤',
          'abnormal': '数据异常',
          'standard': '正常',
          'overWork': '加班'
        },
        //      搜索关键字
        searchData: ''
      };
    },
    components: {
      'classifyData': ClassifyData
    },
    props: ['dataPivot', 'triggerState'],
    methods: {
//    查询
      search: function () {
        this.switchPerson(this.searchData.trim());
      },
      switchPerson: function (str) {
        var self = this;
//      权限控制设置为100次
        self.dataPivot.forEach(function (item, index, array) {
          item.show = false;
          if (str && item.name.indexOf(str) > -1) {
            item.show = true;
          }
        });
        this.$parent.tabAdaptive();
      }
    }
  };
</script>

<style scoped>
  .pivot{
    width: 90%;
    height: auto;
    background-color: #FFF;
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }
  .personlist{
    width: 100%;
    text-align: left;
    margin-bottom: -5px;
    margin-left: -40px;
    height: 40px;
    overflow: hidden;
  }
  .winPivot{
    border-top: 1px solid #339933;
    border-radius: 3px;
  }
  .winPivotSpan{
    font-weight: bold;
    height: 100%;
    position: absolute;
    left: 20px;
    top: 7px;
  }
  .searchinput {
    float: right;
    margin-right: 59px;
    margin-top: -30px;
    border: 1px solid #339933;
    height: 25px;
    width: 150px;
    font-size: 17px;
    border-radius: 2px;
    padding-left: 10px;
  }
  .searchbtn {
    background: #fff;
    float: right;
    margin-top: -30px;
    margin-right: 10px;
    border: 1px solid #339933;
    height: 28px;
    width: 50px;
    font-size: 17px;
    border-radius: 2px;
    color: #339933;
  }.person{
     height: 45px;
     line-height: 30px;
     width: 100px;
     display: inline-block;
     padding: 2px 10px;
     text-align: center;
     margin-right: 5px;
     overflow: hidden;
     white-space: nowrap;
     text-overflow: ellipsis;
     position: relative;
   }
  .personShow{
    background: #fff;
    color: #339933;
    position: absolute;
    left: 0;
    top: 0;
    height: 35px;
    display: block;
    padding-left: 5px;
    border-top: 1px solid #339933;
    border-left: 1px solid #339933;
    border-right: 1px solid #339933;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100px;
  }

</style>
