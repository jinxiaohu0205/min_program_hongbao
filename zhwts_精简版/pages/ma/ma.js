// pages/ma/ma.js
const app = getApp();
var commentjs = require('../../commentJs/comment.js');
Page({
  onLoad: function (options) {
    var that = this;
    if (options) {//扫二维码的数据
      var type = options.aa
      var id = options.id
      wx.setStorageSync('type', type);
      wx.setStorageSync('id', id);
    }
    wx.getSetting({
      success(res) {
        if (JSON.stringify(res.authSetting) == "{}") {
          wx.navigateTo({
            url: '../author/author'
          })
        }
      }
    })
    
  },
  onShow(){
    var type = wx.getStorageSync('type')
    var id = wx.getStorageSync('id')
    var uat = wx.getStorageSync('uat');
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      wx.request({
        url: app.globalData.publicjs.server_Redenvelope_url + "Redenvelope/sweep_yuding",
        method: 'GET',
        data: {
          access_token: uat,
          type: type,
          id: id
        },
        success: function (res) {
          var uid = res.data.data
          var url = res.data.url
          if (url == "redEnvelope") {
            wx.redirectTo({
              url: '../new/hbd/hbd?red_envelope_id=' + uid,
            })
          } else if (url == "index") {
            wx.switchTab({
              url: '../new/maps/maps',
            })
          } else if (url == "ticketDetail") {
            wx.redirectTo({
              url: '../new/scenic/scenic_details/scenic_details?scenic_id=' + uid,
            })
          } else if (url == "hotelDetail") {
            wx.redirectTo({
              url: '../new/hotel/hotel_details/hotel_details?hotel_id=' + uid,
            })
          }
        }
      })
    })
  }
})