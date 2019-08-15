var base64 = require('../utils/base64.js');
//数据中心服务器api地址
var server_api_url = "https://datacenter.sxzhwts.com/api4/";
//票务系统服务器api地址
var ticketserver_api_url = "https://ts.sxzhwts.com/api/";
//酒店服务器api地址
var hotelserver_api_url = "https://hs.sxzhwts.com/api/";
//导游服务器api地址
var guiderserver_api_url = "https://gs.sxzhwts.com/api/";
//打车服务器api地址
var carserver_api_url = "https://driver.sxzhwts.com/api/";
//
var app_server_api_url = "https://apps.sxzhwts.com/api/";
//图片地址
var photoserver = "https://apps.sxzhwts.com";
var banneserver = "https://datacenter.sxzhwts.com";
var hotel_photoserver = "https://hs.sxzhwts.com";
//网址
// var sxzhwts_web_url = 'http://m.sxzhwts.com/';
// 
//客户端名称
var client_name = "android_app";
//客户端密钥
var client_secret = "android_app_password";
// 订单来源
var platform = '微信小程序';
//获取token
function getClientToken() {
  wx.request({
    url: server_api_url + 'Token',
    data: { grant_type: 'client_credentials' },
    header: { 'Content-Type': 'appication/x-www-from-urlencoded', authorization: "Basic" + base64.Base64.btoa('android_app' + "+" + 'android_app_password') },
    success: function (result) {
      wx.setStorage({
        key: 'cat',
        data: result.data.access_token,
        success: function (res) {
  
          wx.setStorageSync('cat', result.data.access_token);
          wx.setStorageSync('cat_expireDate', new Date().getTime() + result.data.expires_in * 1000);
          is_Usertoken();
        },
        fail: function (res) {
        },
        complete: function (res) { }
      })
    },
    fail: function (res) {
      wx.showToast({
        title: '网络异常，请检查您的网络设置！',
        image: '../image/error_icon.png'
      })
    }
  })
}
//判断是否有uat
function is_Usertoken() {
  try {
    wx.getStorage({
      key: 'uat',
      success: function (res) {
        var uat = res.data;
        var value = wx.getStorageSync('ua_expireData');
        if (value && uat) {
          if (new Data().getTime() > value) {
            getUserToken();
          }
        } else {
          getUserToken();
        }
      },
      fail: function (res) {
        getUserToken();
      },
      complete: function (res) { }
    });
  } catch (e) {
    console.log(e)
  }
}
//获取用户token
function getUserToken(userInfo) {
  var cat = wx.getStorageSync('cat');
  var code = '';
  wx.login({
    success: res => {
      code = res.code;
    }
  })
}
// 判断token是否有cat
function is_token() {
  try {
    wx.getStorage({
      key: 'cat',
      success: function (res) {
        var value = wx.getStorageSync('cat_expireDate');        
        if (value) {
          if (new Date().getTime() > value) {
            getClientToken();
          }
        } else {
          getClientToken();
        }
      },
      fail: function () {
        getClientToken();
      },
      complete: function () {
        is_Usertoken();
      }
    });
  } catch (e) {
    console.log(e)
  }
}
module.exports = {
  //数据中心服务器api地址
  server_api_url: "https://datacenter.sxzhwts.com/api4/",
  //票务系统服务器api地址
  ticketserver_api_url: "https://ts.sxzhwts.com/api/",
  //酒店服务器api地址
  hotelserver_api_url: "https://hs.sxzhwts.com/api/",
  //导游服务器api地址
  guiderserver_api_url: "https://gs.sxzhwts.com/api/",
  //打车服务器api地址
  carserver_api_url: "https://driver.sxzhwts.com/api/",
  //活动api地址
  activeserver_api: "https://apps.sxzhwts.com/api/",
  //图片地址
  photoserver: "https://apps.sxzhwts.com",
  banneserver: "https://datacenter.sxzhwts.com",
  hotel_photoserver: "https://hs.sxzhwts.com",
  // getClientToken: getClientToken
  is_token: is_token,
  is_Usertoken: is_Usertoken,
  getUserToken: getUserToken
}
