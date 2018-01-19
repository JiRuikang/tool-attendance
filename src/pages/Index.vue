<template>
  <div id="app">
    <entry @listenChildEvent = "callbackEntry" ref = "indexAdaptive" :triggerState = "triggerState"></entry>
    <pivot :dataPivot = "dataPivot" :triggerState = "triggerState"></pivot>
    <print id="print" :dataPivot = "dataPivot" :triggerState = "triggerState"></print>
    <div class="calendar" v-if="triggerState.calendar">
      <calendar></calendar>
    </div>
    <div class="calendarBtn" @click = "showCalendar" v-else>
      日历
    </div>
    <div class="calendarBtn" @click = "hideCalendar" v-if="triggerState.calendar">
      隐藏
    </div>
  </div>
</template>

<script>
  import Entry from '@/modules/Entry';
  import Pivot from '@/modules/Pivot';
  import Print from '@/modules/Print';
  import Calendar from '@/modules/Calendar';

  export default {
    name: 'app',
    data () {
      return {
//      透视数据
        dataPivot: [],
//      视口宽度
        screenWidth: document.body.clientWidth,
//      显示状态
        triggerState: {
          print: false,
          entry: true,
          searchbox: false,
          calendar: true
        }
      };
    },
    components: {
      'pivot': Pivot,
      'entry': Entry,
      'print': Print,
      'calendar': Calendar
    },
    methods: {
      callbackEntry: function (data) {
        if (data && data.length > 0) {
          this.triggerState.searchbox = true;
        } else {
          this.triggerState.searchbox = false;
        }
        this.dataPivot = data;
        this.tabAdaptive();
      },
      tabAdaptive: function () {
//        tab自适应
        var self = this;
        var widthOutside = window.getComputedStyle(self.$refs.indexAdaptive.$refs.entryAdaptive, null).width;
        var widthInside = 125;
        if (self.dataPivot.length * widthInside > parseInt(widthOutside)) {
          self.dataPivot.sort(function (a) {
            if (a.show === true) {
              return -1;
            } else if (a.show === false) {
              return 1;
            }
          });
        }
      },
      hideCalendar: function () {
        this.triggerState.calendar = false;
      },
      showCalendar: function () {
        this.triggerState.calendar = true;
      }
    },
    mounted () {
      const that = this;
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth;
          that.screenWidth = window.screenWidth;
        })();
      };
    },
    watch: {
      'screenWidth' () {
        this.tabAdaptive();
      }
    }
  };
</script>

<style scoped>
  .mask{
    width: 100%;
    height: 100%;
    background: #333333;
    opacity: 0.5;
    z-index: 10;
    position: fixed;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .searchbox{
    display: none;
  }
  .calendarBtn{
    width: 60px;
    height: 60px;
    background: #99cc00;
    position: fixed;
    right: 0px;
    bottom: 50px;
    border-radius: 60px 0 0 60px;
    line-height: 60px;
    font-size: 20px;
    color: #fff;
  }
  .calendarBtn{
    background: #99cc00;
  }
  .calendarBtn:hover{
    background: #339933;
  }
  .calendar{
    width: 150px;
    height: 250px;
    position: fixed;
    right: 0px;
    bottom: 110px;
    z-index: 100;
  }
</style>
