<template>
  <div class="winPivotUl">
      <slot name="comLate"></slot>
      <li v-for = "item in datalist"  @mouseenter = 'showOptions($event)' @mouseleave = 'hideOptions($event)' v-if = "item.state == index">
        <span class="optionslist" v-if = "item.state != 5">
            <label v-for = "(o, num) in userOptions" @click = 'settag($event,num,item)'>
              {{o}}
            </label>
        </span>
        {{item.time}}/{{item.date}}
      </li>
  </div>
</template>

<script>

  export default {
    name: 'classifyData',
    props: ['datalist', 'index', 'triggerState'],
    data () {
      return {
        userOptions: ['忘打卡', '内部调休', '请假', '忽略']
      };
    },
    methods: {
      showOptions: function (event) {
        var element = event.target.getElementsByClassName('optionslist')[0];
        if (element) {
          element.setAttribute('class', 'optionslist optionsShow');
        }
      },
      hideOptions: function (event) {
        var element = event.target.getElementsByClassName('optionslist')[0];
        if (element) {
          element.setAttribute('class', 'optionslist');
        }
      },
      settag: function (event, num, item) {
        document.body.scrollTop = document.body.scrollHeight;
        this.$props.triggerState.print = true;
        this.$props.triggerState.entry = false;
        item.state = 10 + num;
      }
    }
  };
</script>
st
<style scoped>
  .winPivotUl{
    width: auto;
    height: auto;
    min-height: 30px;
    display: block;
    text-align: left;
    border-bottom: 1px dashed #339933;
    padding-bottom: 20px;
    position: relative;
    padding-left: 130px;
    margin-top: 20px;
  }
  .optionslist{
    display: none;
    float: right;
    font-size: 15px;
    margin-top: -30px;
    background: #fff;
    width: 230px;
    margin-left: 146px;
    font-weight: normal;
    height: 30px;
    line-height: 30px;
    border-top: 1px solid #339933;
    border-left: 1px solid #339933;
    border-right: 1px solid #339933;
    border-radius: 5px 5px 0 0;
  }
  .optionslist label{
    padding: 5px;
    background: #99cc00;
    display: inline-block;
    height: 30%;
    line-height: 50%;
    vertical-align: middle;
    border-radius: 5px;
    color: #fff;
    margin-left: 5px;
  }
  .optionslist label:hover{
    background: #339933 !important;
  }
  .optionsShow {
    display: block;
  }
  .winPivot li{
    width: 300px;
    height: 40px;
    line-height: 40px;
    color: #000000;
    font-size: 20px;
    display: inline-block;
    border-radius: 5px;
    margin-left: 10px;
    text-align: center;
    margin-bottom: 5px;
    border: 1px solid #339933;
  }
  .standard li{
    background: #339933;
    border-color: #339933;
  }
  .absenteeism li{
    background: #CC9900;
    border-color: #CC9900;
  }
  .comeLate li{
    background: #FFCC33;
    border-color: #FFCC33;
  }
  .leaveEarly li,.comeLate li{
    background: #FF9900;
    border-color: #FF9900;
  }
  .abnormal li{
    background: #CCC;
    border-color: #CCC;
  }
  .overWork li{
    background: #336699;
    border-color: #336699;
  }
</style>
