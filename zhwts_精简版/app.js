//const ald = require('utils/ald-stat.js')
var base64 = require('utils/base64.js');
var publicjs = require('commentJs/public.js');
const Promise = require('utils/promise.js'); 
App({
  //监听初始化 全局只触发一次
  onLaunch: function () {
    var that = this;
    wx.request({
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded", authorization: "Basic " + base64.Base64.btoa('android_app' + ":" + 'android_app_password')
      }, // 设置请求的 header
      url: publicjs.server_api_url + 'Token',
      data: {
        grant_type: 'client_credentials',
      },
      success: function (result){
        wx.setStorageSync('cat', result.data.access_token);
        var timestamp = Date.parse(new Date());
        var expiration = timestamp + 1000000; 
        wx.setStorageSync("cat_expiration", expiration)
      }
    })
  },
  globalData: {
    userInfo: null,
    publicjs: publicjs,
  },
  getToken: function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
      var cat_expiration = wx.getStorageSync('cat_expiration');
      var timestamp = Date.parse(new Date());//拿到现在时间
      if (cat_expiration < timestamp) { //过期重新获取cat
        wx.request({
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded", authorization: "Basic " + base64.Base64.btoa('android_app' + ":" + 'android_app_password')
          }, // 设置请求的 header
          url: publicjs.server_api_url + 'Token',
          data: {
            grant_type: 'client_credentials',
          },
          success: function (result) {
            wx.setStorageSync('cat', result.data.access_token);
            var timestamp = Date.parse(new Date());
            var expiration = timestamp + 1000000; 
            wx.setStorageSync("cat_expiration", expiration);
            resolve(result.data.access_token);
          }
        })
      }else{
        resolve(wx.getStorageSync('cat'));
      }
    })
  },
  getTokenUat: function () {
    let _this = this;
    return new Promise(function (resolve, reject) {
      var uat_expiration = wx.getStorageSync('uat_expiration');
      var timestamp = Date.parse(new Date());//拿到现在时间
      if (uat_expiration < timestamp){ //过期重新获取 uat
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
              var code = res.code;
              _this.getToken().then(function (res) {
                var cat = res;
                wx.getUserInfo({
                  success: function (result) {
                    // console.log(result)     //授权成功，返回用户信息
                    wx.request({
                      method: 'POST',
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      url: publicjs.server_api_url + 'wxlogin/smallProgramLogin',
                      data: {
                        access_token: cat,
                        code: code,
                        nickName: result.userInfo.nickName,
                        avatarUrl: result.userInfo.avatarUrl,
                        province: result.userInfo.province,
                        city: result.userInfo.city,
                        gender: result.userInfo.gender,
                        country: result.userInfo.country,
                        encryptedData: result.encryptedData,
                        iv: result.iv
                      },
                      success: function (resu) {
                        console.log("插入小程序登录用户信息成功！");
                        wx.setStorageSync('uat', resu.data.data);
                        var timestamp = Date.parse(new Date());
                        var expiration = timestamp + 3600000 * 24 * 15; //缓存
                        wx.setStorageSync("uat_expiration", expiration);
                        resolve(resu.data.data);
                      }
                    });
                  }
                })
              })
            } else {
              reject('error');
            }
          }
        })
      }else{
        resolve(wx.getStorageSync('uat'));
      }
    })
  }
})