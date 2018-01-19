<template>
  <div class="pivot" >
    <section class="winPivot"  v-for = "datalist in dataPivot" v-if = "datalist.show == true && triggerState.print == true">
      <classifyData  v-for="(val, key, index) in printEnum" :datalist = "datalist.list" :class="key" :index = "'1' + index" :key = "index" :triggerState = "triggerState">
        <span class="winPivotSpan" slot="comLate">{{val + ':'}}</span>
      </classifyData>
      <!--<cookie :dataForSet = '{"name":datalist.name.split("/")[0],"id":datalist.name.match(/[0-9]/g).join(""),"depart":datalist.name.split("/")[1].replace(/[^\u4e00-\u9fa5]/gi, "").toString(),"list":datalist.list}'></cookie>-->
      <input type="button" value="发给考勤员" @click = "print"/>
    </section>
  </div>
</template>

<script>
  import ClassifyData from '@/components/ClassifyData';
  import utils from '@/scripts/utils';

  export default {
    name: 'print',
    data () {
      return {
        printEnum: {
          'certificate': '考勤证明',
          'paidLeave': '内部调休',
          'askLeave': '请假',
          'ignore': '忽略'
        }
      };
    },
    components: {
      'classifyData': ClassifyData
    },
    props: ['dataPivot', 'triggerState'],
    methods: {
      print: function () {
        var self = this;
        utils.clearAllCookies('printData');
        for (var v in self.dataPivot) {
          if (self.dataPivot[v].show === true) {
//            utils.setCookies('print' + 'Des', self.dataPivot[v].name.replace(/[^\u4e00-\u9fa5]/gi, ''));
            var cookiesData = self.dataPivot[v].list;
            for (var c in cookiesData) {
              if (cookiesData[c].state - 10 >= 0) {
                utils.setCookies('printData' + c, JSON.stringify(cookiesData[c]));
              }
            }
          }
        }
        window.open(location.href + 'print');
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
  .winPivot{
    border-top: 1px solid #339933;
    border-radius: 3px;
    margin-bottom: 20px;
  }
  .winPivotSpan{
    font-weight: bold;
    height: 100%;
    position: absolute;
    left: 20px;
    top: 7px;
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
