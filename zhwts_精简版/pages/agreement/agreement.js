// pages/agreement/agreement.js
var commentjs = require('../../commentJs/comment.js');

var app=getApp();
Page({
  data: {
    id:'',
    title:'',
    content:'',
    tag:''
  },
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.setData({
      tag:options.tag
    });
    this.getViewData();
  
  },

  getViewData: function () {
    var that = this;
    var cat = wx.getStorageSync('cat');
    wx.request({
      url: app.globalData.publicjs.server_api_url + 'Agreement/getagreement?access_token=' + cat + '&tag='+ that.data.tag,
      method: 'GET',
      success: function (res) {
        if (res.data.code == 1) {
          var data = res.data.data;
          that.setData({
            title:data.title,
            content: data.content.replace(/<[^>]+>/, "").replace(/<[^>]+>/g, "\n").replace(/\n\n/g, "\n"),
          });
          wx.hideLoading();
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../new/img/warn_icon.png',
            success: function (res) { }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '请求出错请重试',
          image: '../new/img/error_icon.png',
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })

  }
})