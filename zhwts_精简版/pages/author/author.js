var app = getApp();
var publicjs = require('../../commentJs/public.js');
var yuanurl;
Page({
  data:{
    canIUse: wx.canIUse('button.open-type.getUserInfo')   //当前版本是否可用
  },

  onLoad: function (options) {
    
  },
  bindGetUserInfo: function (e) {    //授权操作
    var cat = wx.getStorageSync('cat'); 
    if (e.detail.userInfo) {
      var that = this;
      var cat = wx.getStorageSync('cat');
      var openid = wx.getStorageSync('openid');
      var code = wx.getStorageSync('code');
      wx.request({
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: publicjs.server_api_url + 'wxlogin/smallProgramLogin',
        data: {
          access_token: cat,
          code:code,
          nickName: e.detail.userInfo.nickName,
          avatarUrl: e.detail.userInfo.avatarUrl,
          province: e.detail.userInfo.province,
          city: e.detail.userInfo.city,
          gender: e.detail.userInfo.gender,
          country: e.detail.userInfo.country,
          encryptedData: e.detail.encryptedData,
          iv:e.detail.iv
        },
        success: function (res) {     
          wx.setStorageSync('uat', res.data.data);
          var timestamp = Date.parse(new Date());
          var expiration = timestamp + 3600000*24*15; 
          wx.setStorageSync("uat_expiration", expiration)
          wx.getUserInfo({
            success: function (res) {//授权成功，返回用户信息
              const nickname = res.userInfo.nickName;
              const city = res.userInfo.city;
            }
          })
        }
      });
      wx.navigateBack({
        delta:1
      })
    } else {
      wx.showModal({ //用户按了拒绝按钮
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“拒绝授权”')
          }
        }
      })
    }
  }
})
