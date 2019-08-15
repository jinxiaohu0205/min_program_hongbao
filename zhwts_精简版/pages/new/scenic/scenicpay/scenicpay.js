var commentjs = require('../../../../commentJs/comment.js');

var app = getApp();
Page({
  data: {
    amount: '',
    hotelname: '',
    roomtype: '',
    breakfast: '',
    endtime: '',
    orderid: '',
    ordercode: '',
    scenicname: '',
    longitude: '',
    latitude: '',
    date:''
  },
  onLoad: function (options) {
    var orderid = options.order_id;
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
        url: app.globalData.publicjs.ticketserver_api_url + 'user/order',
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          order_id: orderid,
          access_token: uat
        },
        success: function (res) {
          var data = res.data.data;
          var orderid = res.data.data.id
          var latitude = res.data.data.scenic.latitude
          var longitude = res.data.data.scenic.longitude

          var totalSecond = res.data.data.create_time * 1000;    //创建的时间戳
          var createtimedate = commentjs.dateformat(new Date(totalSecond), 'hh:mm:ss');    //创建的时间
          var year = new Date(totalSecond).getFullYear();
          var month = new Date(totalSecond).getMonth() + 1;
          var date = new Date(totalSecond).getDate();
          var hour = new Date(totalSecond).getHours() + 2;
          var minutes = new Date(totalSecond).getMinutes();
          var seconds = new Date(totalSecond).getSeconds();
          var aaa = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + seconds;
          that.setData({
            amount: data.amount,     //钱
            endtime: aaa,
            scenicname: data.scenic.name,
            orderid: data.id,
            ordercode: data.order_code,
            latitude: data.scenic.latitude,
            longitude: data.scenic.longitude,
            date: data.date
          })
        }
      })
    })
  },
  pay: function () {
    var uat = wx.getStorageSync('uat');
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
      wx.request({
        url: app.globalData.publicjs.server_api_url + 'payment/smallProgramwxPay',
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat,
          type: 1,
          order_id: that.data.orderid,
          order_code: that.data.ordercode,
          goods_name: that.data.scenicname
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
                      url: '../../hotel/paysuccess/paysuccess?order_id=' + orderid + '&latitude=' + latitude + '&longitude=' + longitude + '&dingdantype=scenic',
                    })
                  }
                })
              }
            })
          }
        }
      })
    })

  }
})