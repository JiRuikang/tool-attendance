<template>
    <div class="drop" @dragenter = "doDrag" @dragover = "doDrag">在虚线框中拖入excle文件<br>或<br>粘贴文件内容到右侧输入框</div>
</template>

<script>
  import XLSX from 'xlsx';
  var wb;
  //  读取完成的数据
  var rABS = false;
  //  是否将文件读取为二进制字符串
  export default {
    methods: {
      importExcel: function (obj) {
        var self = this;
//        var obj = event.target;
        if (!obj.files) {
          return;
        }
        var f = obj.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
          var data = e.target.result;
          if (rABS) {
            wb = XLSX.read(btoa(self.fixdata(data)), {
//              手动转化
              type: 'base64'
            });
          } else {
            wb = XLSX.read(data, {
              type: 'binary'
            });
          }
//          wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
//          wb.Sheets[Sheet名]获取第一个Sheet的数据
          var excelTrList = [];
          var xlsxData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          for (var object in xlsxData) {
            var excelTr = '';
            var xlsxDataObject = xlsxData[object];
            for (var o in xlsxDataObject) {
              excelTr += '  ' + xlsxDataObject[o];
            }
            excelTrList.push(excelTr);
          }
          var dataOriginal = '';
          excelTrList.forEach(function (item, index, array) {
            dataOriginal += item + '\n';
          });
          self.$emit('listenImportEvent', dataOriginal);
        };
        if (rABS) {
          reader.readAsArrayBuffer(f);
        } else {
          reader.readAsBinaryString(f);
        }
      },
      fixdata: function (data) {
//        文件流转BinaryString
        var o = '';
        var w = 10240;
        for (var l = 0; l < data.byteLength / w; ++l) {
          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        }
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
      },
      handleDragover: function (e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      },
      handleDrop: function (e) {
        e.stopPropagation();
        e.preventDefault();
        this.importExcel(e.dataTransfer);
      },
      doDrag: function (event) {
        var drop = event.target;
        drop.addEventListener('dragenter', this.handleDragover, false);
        drop.addEventListener('dragover', this.handleDragover, false);
        drop.addEventListener('drop', this.handleDrop, false);
      }
    }
  };
</script>

<style scoped>
  .drop {
    display: inline-block;
    border:2px dashed #bbb;
    -moz-border-radius:5px;
    -webkit-border-radius:5px;
    border-radius:5px;
    padding-top:25px;
    text-align:center;
    font:20pt bold,"Vollkorn";color:#bbb;
    width: 45%;
    vertical-align: top;
    height: 275px;
  }
</style>
