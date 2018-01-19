<template>
  <div class="printPage">
    <div class="printDiv">
      <button @click = "getPrint" class="printBtn" v-if="printState">打印</button>
    </div>
    <li v-for="data in dataPrint" type="none" :key="data.state">
      <div class="certificate printSeaction" v-if="data.state == 10">
        <div class="trLeave">
          <h4>考勤证明</h4>
        </div>
        <div class="trLeave">
          <label>姓名:</label>
          <input type="text" v-model="data.des.split('/')[0]"/>
          <label>部门：</label>
          <input type="text" v-model="data.des.split('/')[1]"/>
          <label>原因：</label>
          <input type="text" placeholder="忘记打卡"/>
        </div>
        <div class="trLeave">
          <label>申请日期：</label>
          <input type="text"  v-model="data.date"/>
          <input type="text" v-model="data.time" id="longLeave"/>
        </div>
        <div class="trLeave">
          <label>部门核准人：</label>
          <input type="text"/>
          <label>HR负责人：</label>
          <input type="text"/>
        </div>
      </div>
      <div class="paidLeave printSeaction" v-if="data.state == 11 || data.state ==12">
        <div class="trLeave">
          <h4>请假单</h4>
        </div>
        <div class="trLeave">
          <input type="checkbox" v-if="data.state == 12" checked = "checked" class="checkbox"/>
          <input type="checkbox" v-if="data.state ==11" class="checkbox"/>
          <span>事假</span>
          <input type="checkbox" class="checkbox"/><span>病假</span>
          <input type="checkbox" class="checkbox"/><span>调休</span>
          <input type="checkbox" class="checkbox"/><span>年假</span>
          <input type="checkbox" checked = "checked"  class="checkbox" v-if="data.state == 11"/>
          <input type="checkbox" class="checkbox" v-if="data.state == 12"/>
          <span>其它请注明：</span>
          <input type="text"  value="内部调休" v-if="data.state == 11"/>
          <input type="text"  v-if="data.state == 12"/>
        </div>
        <div class="trLeave">
          <label>申请人：</label>
          <input type="text" v-model="data.des.split('/')[0]"/>
          <label>部门：</label>
          <input type="text" v-model="data.des.split('/')[1]" id="longLeave"/>
        </div>
        <div class="trLeave">
          <label>职位：</label>
          <input type="text" />
          <label>职位代替人：</label>
          <input type="text"/>
        </div>
        <div class="trLeave" v-if="data.time != '无打卡记录'">
          <label>休假日期：</label>
          <input type="text"  v-model="data.date"/>
          <input type="text" v-model="data.time" id="longLeave"/>
          <label>
            共
            <input type="text" value="1" id="shortLeave" v-if="data.time.split('-')[1].split(':')[0]-data.time.split('-')[0].split(':')[0] >= 9"/>
            <input type="text" value="0.5" id="shortLeave" v-else />
            天
          </label>
        </div>
        <div class="trLeave" v-else>
          <label>休假日期：</label>
          <input type="text"  v-model="data.date"/>
          <input type="text" value="8:30-17:30" id="longLeave"/>
          <label>
            共
            <input type="text" value="1" id="shortLeave" />
            天
          </label>
        </div>
        <div class="trLeave">
          <label>申请人签名/日期：</label>
          <input type="text"/>
        </div>
        <div class="trLeave">
          <label>部门负责人签名/日期：</label>
          <input type="text"/>
          <label>批准人签名/日期：</label>
          <input type="text"/>
        </div>
      </div>
    </li>
  </div>
</template>

<script>
  export default {
    name: 'PagePrint',
    data () {
      return {
        dataPrint: [],
        printState: true
      };
    },
    mounted () {
      var cookies = document.cookie.split(/; */);
      var self = this;
      cookies.forEach(function (value) {
        if (value.split('=')[0].indexOf('printData') >= 0) {
          self.dataPrint.push(JSON.parse(value.split('=')[1]));
        }
      });
    },
    methods: {
      getPrint () {
        this.printState = false;
        this.$nextTick(function () {
          window.print();
        });
      }
    }
  };
</script>

<style scoped>
  .printPage{
    background: #fff;
    letter-spacing: 2px;
    font-size: 15px;
    color: #000;
    outline: none;
  }
  h4 {
    margin-left: auto;
    margin-right: auto;
    width: 100px;
  }
  .printSeaction {
    width: 794px;
    display: block;
    background: #fff;
    padding:10px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
    border: 1px solid #000;
    margin-top: 5px;
  }
  .paidLeave{
    height: 300px;
  }
  .certificate {
    height: 200px;
  }
  .trLeave {
    width: 100%;
    display: block;
    padding: 5px;
    height: auto;
  }
  .trLeave .checkbox {
    display: inline-block;
    width: 30px;
    vertical-align: middle;
    margin-right: 3px;
    margin-bottom: 0px;
    margin-top: 0px;
    margin-left: 30px;
  }
  .trLeave span {
    margin-left: -10px;
  }
  .trLeave label {
    vertical-align: middle;
    padding-left: 30px;
  }
  .printPage input {
    width: 120px;
    border: none;
    border-bottom: 1px solid black;
    background: #fff;
    border-radius: 0;
    color: black;
    margin-left: 0px;
    background: #fff;
    letter-spacing: 2px;
    font-size: 15px;
    outline: none;
  }
  #shortLeave {
    width: 40px;
  }
  #longLeave {
    width: 200px;
  }
  .printBtn {
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
  .printBtn:hover {
    background: #339933;
    color: #fff;
  }
  .printDiv {
    width: 150px;
    margin-right: auto;
    margin-left: auto;
  }
</style>
