export default {
  getCookies: function (name) {
    var reg = new RegExp('(^| )' + name + '([^;]*)(;|$)');
    var arr = document.cookie.match(reg);
    if (arr) {
      return arr[2];
    } else {
      return null;
    }
  },
  setCookies: function (name, value) {
    var Days = 0.1;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + exp.toGMTString();
  },
  clearAllCookies: function (str) {
    var cookies = document.cookie.split(/; */);
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      if (cookie && str.indexOf(cookie.split('=')[0].replace(/[0-9]/gi, '')) >= 0) {
        var eqPos = cookie.indexOf('=');
        var name = cookie.substr(0, eqPos);
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      }
    }
  }
};
