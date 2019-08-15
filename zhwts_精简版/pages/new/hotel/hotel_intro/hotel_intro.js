var commentjs = require('../../../../commentJs/comment.js');
var app = getApp();
Page({
  data: {
    hotel_id: '',
    devicetype: [],
    device: [],
    telephone: ''
  },
  onLoad: function (options) {
    var hotel_id = options.id;
    this.setData({
      hotel_id: hotel_id
    });
    this.getViewData();
  },
  getViewData: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
      var cat = wx.getStorageSync('cat');
      wx.request({
        url: app.globalData.publicjs.hotelserver_api_url + 'hotel/device',
        method: "GET",
        data: { access_token: cat, hotel_id: that.data.hotel_id },
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            });
            return false;
          }
          var data = res.data.data.devicetype;
          var devicetype = [];
          for (let i = 0; i < data.length; i++) {
            var type = data[i];
            var type_data = {};
            type_data.name = type.name;    //类型名字
            type_data.id = type.device_type_id;    //类型id
            type_data.device = type.device;
            devicetype.push(type_data);
          }
          that.setData({
            devicetype: devicetype,
          });
        },
        complete: function (res) {
          wx.hideLoading();
        }
      });
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
    })
  }
})