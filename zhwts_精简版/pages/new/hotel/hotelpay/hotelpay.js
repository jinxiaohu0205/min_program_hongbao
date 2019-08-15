var commentjs = require('../../../../commentJs/comment.js');

var app =getApp();
Page({
  data: {
    time:'',
    amount:'',
    hotelname:'',
    roomtype:'',
    breakfast:'',
    createtime:'',
    starttime: '',
    endtime:'',
    day_count:'',
    orderid:'',
    ordercode:'',
    goodsname:'',
    longitude:'',
    latitude:'',
    enddate:""
  },
  onLoad: function (options) {
    // console.log(options);
    var orderid=options.order_id;
    var that = this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat = wx.getStorageSync('uat');
      wx.request({
        // https://hs.sxzhwts.com/api/Order/orderdetail/?order_id=8406FFA1-04A1-0012-02A8-C11044E4A5E0&access_token=6b1b4769ac20cda65b0bd1a3906bcf4b66e5ebaf
        url: app.globalData.publicjs.hotelserver_api_url + 'Order/orderdetail',
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          order_id: orderid,
          access_token: uat
        },
        success: function (res) {
          var data = res.data.data;
          var orderid = res.data.data.id
          var latitude = res.data.data.hotel.latitude
          var longitude = res.data.data.hotel.longitude

          var totalSecond = res.data.data.create_time * 1000;    //创建的时间戳
          var createtimedate = commentjs.dateformat(new Date(totalSecond), 'hh:mm:ss');    //创建的时间
          var year = new Date(totalSecond).getFullYear();
          var month = new Date(totalSecond).getMonth() + 1;
          var date = new Date(totalSecond).getDate();
          var hour = new Date(totalSecond).getHours() + 2;
          var minutes = new Date(totalSecond).getMinutes();
          var seconds = new Date(totalSecond).getSeconds();
          var aaa = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds;
          var enddate = aaa
          that.setData({
            enddate: enddate,      //倒计时
            amount: data.amount,     //钱
            hotelname: data.hotel.name,   //房间名字
            roomtype: data.roomtype.name,    //房型
            breakfast: data.roomtype.has_breakfast,     //早餐
            day_count: data.day_count,     //住几晚
            starttime: commentjs.dateformat(new Date(data.from_date * 1000), 'MM-dd'),//入住时间
            endtime: commentjs.dateformat(new Date(data.end_date * 1000), 'MM-dd'),//结束时间
            orderid: data.id,
            ordercode: data.order_code,
            goodsname: data.hotel.name,
            latitude: data.hotel.latitude,
            longitude: data.hotel.longitude,
          })
        }
      })
    })
 
  },
  pay:function(){
    var orderid = this.data.orderid;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    //验证cat过期没有
    var that = this;
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat = wx.getStorageSync('uat');
      wx.request({
        url: app.globalData.publicjs.server_api_url + 'payment/smallProgramwxPay',
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat,
          type: 2,
          order_id: that.data.orderid,
          order_code: that.data.ordercode,
          goods_name: that.data.goodsname
        },
        success: function (res) {
          if (res.data.code == 1) {
            var data = res.data.data;
            wx.requestPayment({
              'timeStamp': data.timeStamp,
              'nonceStr': data.nonceStr,
              'package': data.package,
              'signType': 'MD5',
              'paySign': data.paySign,
              'success': function (res) {
                wx.showToast({
                  title: '付款成功',
                  success: function () {
                    wx.redirectTo({
                      url: '../paysuccess/paysuccess?order_id=' + orderid + '&latitude=' + latitude + '&longitude=' + longitude,
                    })
                  }
                })
              },
              'fail': function (res) {
                wx.showToast({
                  title: '失败,请重试',
                  image: '/img/error_icon.png'
                })
              },
              'complete': function (res) {
                // console.log(res);
              }
            })
          }

        }
      })
    })

  }
})