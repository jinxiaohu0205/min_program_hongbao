function dateformat(_this, fmt) {
  var o = {
    "M+": _this.getMonth() + 1, //月份
    "d+": _this.getDate(), //日
    "h+": _this.getHours() % 12 == 0 ? 12 : _this.getHours() % 12, //小时
    "H+": _this.getHours(), //小时
    "m+": _this.getMinutes(), //分
    "s+": _this.getSeconds(), //秒
    "q+": Math.floor((_this.getMonth() + 3) / 3), //季度
    "S": _this.getMilliseconds() //毫秒
  };
  var week = {
    "0": "日",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[_this.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

function addDate(dd, dadd, fmt) {
  var a;
  if (dd instanceof Date) {
    a = dd;
  } else {
    dd = dd.replace(/-|\./g, "/");
    a = new Date(dd)
  }
  a = a.valueOf()
  a = a + dadd * 24 * 60 * 60 * 1000
  a = new Date(a)
  if (!!fmt) {
    return dateformat(a, fmt);
  }
  return a;
}

// 计算距离
function Rad(d) {
  return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1, lng1, lat2, lng2) {

  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里
  //s=s.toFixed(4);
  return s;
}


function formatDate(number,n) {

  var b = number * 1000;
  var now = new Date(b);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  if (n){
    return  year + "-" + month + "-" + date;
  } else {
    return  year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  }
} 
//判断手机号是否正确
function is_phone(phone) {
  if (!(/^1[3456789]\d{9}$/.test(phone))) {
    return false;
  }
  return true;
}


function is_idcard(code) {
  // var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  // if (reg.test(idcard) === false) {
  //   return false;
  // }
  // return true;function IdentityCodeValid(code) {
  // console.log(code);
  var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };

  var tip = "";

  var pass = true;

  if (!code || !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)) {

    tip = "身份证号格式错误";

    pass = false;

  }

  else if (!city[code.substr(0, 2)]) {

    tip = "地址编码错误";

    pass = false;

  }

  else {

    //18位身份证需要验证最后一位校验位

    if (code.length == 18) {

      code = code.split('');

      //∑(ai×Wi)(mod 11)

      //加权因子

      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];

      //校验位

      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];

      var sum = 0;

      var ai = 0;

      var wi = 0;

      for (var i = 0; i < 17; i++) {

        ai = code[i];

        wi = factor[i];

        sum += ai * wi;

      }

      var last = parity[sum % 11];

      if (parity[sum % 11] != code[17]) {

        tip = "校验位错误";

        pass = false;

      }

    }

  }

  if (!pass) {
    // wx:wx.showToast({
    //   title: tip,
    //   icon: 'none',
    // })
    return tip;
  }

  return pass;
}

module.exports = {
  dateformat: dateformat,
  addDate: addDate,
  formatDate: formatDate,
  is_phone:is_phone,
  is_idcard: is_idcard,
  GetDistance: GetDistance
}
