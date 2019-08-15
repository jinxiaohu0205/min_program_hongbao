// pages/new/me/women/women.js
var WxParse = require('../../../../wxParse/wxParse.js');
const app = getApp();
Page({
  data: {
  },
  onLoad: function (options) {
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
        url: app.globalData.publicjs.server_Redenvelope_urls + 'User/about_us',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat
        },
        success: function (res) {
          var detail=res.data.data.content;
          WxParse.wxParse('content', 'html', detail, that, 30);
        }
      })
    })
  }
})