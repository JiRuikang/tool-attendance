<template>
  <div class="dialog" >
    <!--<input type="text" class="userId" v-model = "searchId" type ="number">-->
    <!--<input type="button" value="确定" class="dialogBtn" @click = "searchById(searchData)">-->
    <!--<label  class="dialogLabel" v-if= "triggerState.dialogTip">数据源中无此工号</label>-->
    <!--<label class="dialogLabel">您已查看了三人的信息，请自觉尊重他人隐私</label>-->
  </div>
</template>

<script>
export default {
  name: 'mydialog',
  data () {
    return {
      searchId: '',
      userDec: ''
    };
  },
  methods: {
    searchById: function () {
      var self = this;
      var id = self.searchId;
      if ((id.length === 10) || id === '7895123') {
        this.$parent.showPerson(id);
      } else {
        this.$parent.triggerState.dialogTip = true;
      }
    }
  }
};
</script>

<style>
  .dialog{
    background: #fff;
    width: 300px;
    height: auto;
    border-radius: 10px;
    padding: 50px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -100px 0 0 -150px;
    z-index: 99;
  }
  .userId{
    border: 1px solid #339933;
    height: 25px;
    width: 150px;
    font-size: 17px;
    border-radius: 2px;
    padding-left: 10px;
  }
  .dialogLabel{
    font-size: 15px;
    display: block;
    margin-top: 20px;
    color: red;
  }
  .dialogBtn{
    border: 1px solid #339933;
    height: 28px;
    width: 100px;
    font-size: 17px;
    border-radius: 2px;
    color: #fff;
    background: #339933;
    vertical-align: middle;
    margin-left: 10px;
  }
</style>
