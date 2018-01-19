<template>
  <div class="calendar">
    <div class="calendar-header" v-if="init">
      <div class="calendar-ctrl calendar-ctrl-pre" @click="pre"></div>
      <div class="calendar-title">{{init.year}}年{{init.month}}月</div>
      <div class="calendar-ctrl calendar-ctrl-next" @click="next"></div>
    </div>
    <table>
      <thead>
      <tr>
        <th>日</th>
        <th>一</th>
        <th>二</th>
        <th>三</th>
        <th>四</th>
        <th>五</th>
        <th>六</th>
      </tr>
      </thead>
      <tbody v-if="list.length > 0">
      <tr v-for="item in list">
        <td v-for="column in item">
          <div v-if="column" class="calendar-td"
               :class="[now.dateStr < column.dateStr ? 'calendar-disable' : '',
               selected.dateStr === column.dateStr ? 'calendar-selected' : '' ]"
               @click="cb(column)">{{column.date}}
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>

  .calendar {
    padding: 20px;
    background-color: #fff;
    border: solid 1px #339933;
    border-radius: 4px 0 0 4px;
  }

  .calendar-header {
    padding: 10px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .calendar-ctrl {
    flex: 0 1 20%;
  }

  .calendar-title {
    flex: 0 1 60%;
    text-align: center;
  }

  .calendar-ctrl:before {
    content: '';
    display: inline-block;
    width: 7px;
    height: 7px;
    border-bottom: 2px solid; /*no*/
    border-right: 2px solid; /*no*/
    border-color: #339933;
    transform-origin: 50% 50%;
  }

  .calendar-ctrl:before:active {
    background-color: transparent;
  }

  .calendar-ctrl-pre {
    text-align: right;
  }

  .calendar-ctrl-pre:before {
    transform: rotateZ(135deg);
  }

  .calendar-ctrl-next:before {
    transform: rotateZ(-45deg);
  }

  table {
    color: #333;
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    text-align: center;
    background-color: transparent;
  }

  tr th:last-child, tr th:first-child {
    color: #f60;
  }

  th {
    line-height: 32px;
    height: 30px;
    font-weight: bolder;
  }

  td {
    line-height: 30px;
  }

  .calendar-td {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .calendar-disable {
    pointer-events: none;
    color: #b7b7b7;
  }

  .calendar-selected:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 23px;
    height: 23px;
    border: 2px solid #f60; /*no*/
    border-radius: 23px;
    z-index: 2;
  }
</style>
<script>
  import UcarDate from 'ucar-date';

  export default {
    data () {
      return {
        now: new UcarDate(new Date()),
        init: new UcarDate(new Date()),
        list: [],
        selected: new UcarDate(new Date())
      };
    },
    watch: {
      init (newVal) {
        if (!(newVal instanceof UcarDate)) return;
        this.renderTable();
      }
    },
    methods: {
      renderTable () {
        const list = [];
        const u = this.init;
        const arr = u.getAllOfMonth();
        const LENGTH = arr.length;
        const TOTALLENGTH = u.offsetOfLastMonth + LENGTH;
        let row = 5;
        if (TOTALLENGTH === 28) row = 4;
        if (TOTALLENGTH > 35) row = 6;
        let num = 0;
        for (let i = 0; i < row; i += 1) {
          list.push([]);
          if (i === 0) {
            for (let j = 0; j < u.offsetOfLastMonth; j += 1) {
              list[i].push(null);
            }
          }
          while (list[i].length < 7) {
            if (num <= LENGTH) {
              list[i].push(arr[num]);
              num += 1;
            } else {
              list[i].push(null);
            }
          }
        }
        this.list = list;
        return list;
      },
      pre () {
        this.init = this.init.getAllOfPreMonth()[0];
      },
      next () {
        this.init = this.init.getAllOfNextMonth()[0];
      },
      cb (item) {
        this.selected = item;
        this.$emit('selectDate', item);
      }
    },
    mounted () {
      this.renderTable();
    }
  };
</script>
