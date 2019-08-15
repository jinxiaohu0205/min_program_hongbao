const app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    templenew_id:'',
    hits: '',
    create_time: '',
    title: '',
    article: []
  },
  onLoad: function (options) {
    var templenew_id = options.templenew_id;
    wx.setStorageSync('templenew_id', templenew_id);
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    that.setData({
      templenew_id: options.templenew_id
    })
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
      var cat = wx.getStorageSync('cat');
      wx.request({
        url: app.globalData.publicjs.activeserver_api + 'temple/templenewDetaile',
        method: 'GET',
        data: { access_token: cat, templenew_id: that.data.templenew_id, },
        success: function (res) {
          if (res.data.code == 1) {
            var data = res.data.data;
            that.setData({
              hits: data.hits,
              create_time: data.create_time,
              title: data.title
            })
            var article = data.contents;
            WxParse.wxParse('contents', 'html', article, that, 30);
          }
        }, complete: function (res) {
          wx.hideLoading();
        }
      })
    })
  },
  onShow: function (options) {
    var that = this;
    var templenew_id = wx.getStorageSync('templenew_id')
    this.setData({
      templenew_id: templenew_id
    });
    var cat = wx.getStorageSync('cat');
    var uat = wx.getStorageSync('uat');
    app.getToken().then(function (res) {
      //这里说明就存上了cat
      var cat = wx.getStorageSync('cat');
      wx.request({
        url: app.globalData.publicjs.activeserver_api + 'temple/templenewDetaile',
        method: 'GET',
        data: { access_token: cat, templenew_id: that.data.templenew_id, },
        success: function (res) {
          if (res.data.code == 1) {
            var data = res.data.data;
            that.setData({
              hits: data.hits,
              create_time: data.create_time,
              title: data.title
            })
            var article = data.contents;
            WxParse.wxParse('contents', 'html', article, that, 30);
          }
        }, complete: function (res) {
          wx.hideLoading();
        }
      })
    })
  },
  onShareAppMessage: function () {//转发
    return {
      title: this.data.title,
      imageUrl: "../img/wu.jpg"
    }
  }
})