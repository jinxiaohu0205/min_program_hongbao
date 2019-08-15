var base64 = require('../utils/base64.js');
//数据中心服务器api地址
var server_api_url = "https://datacenter.sxzhwts.com/api4/";
var datacenter_api_url = "https://datacenter.sxzhwts.com/";
var server_Redenvelope_url = "https://datacenter.sxzhwts.com/api/";
var server_token="https://datacenter/api";
var server_Redenvelope_urls = "https://datacenter.sxzhwts.com/api4/";
//票务系统服务器api地址
var ticketserver_api_url = "https://ts.sxzhwts.com/api/";
var ticketserver_api_urls = "https://ts.sxzhwts.com/api4/";
//酒店服务器api地址
var hotelserver_api_url = "https://hs.sxzhwts.com/api/";
var hotelserver4_api_url = "https://hs.sxzhwts.com/api4/";
//导游服务器api地址
var guiderserver_api_url = "https://gs.sxzhwts.com/api/";
//打车服务器api地址
var carserver_api_url = "https://driver.sxzhwts.com/api/";
var app_server_api_url = "https://apps.sxzhwts.com/api/";
//图片地址
var photoserver = "https://apps.sxzhwts.com";
var banneserver = "https://datacenter.sxzhwts.com";
//网址
// var sxzhwts_web_url = 'http://m.sxzhwts.com/';
//客户端名称
var client_name = "android_app";
//客户端密钥
var client_secret = "android_app_password";
// 订单来源
var platform = '微信小程序';
var appid = 'wxf5943df81379af17';
//获取客户token(client access_token)
function getClientToken(login, callback) {      
  wx.request({
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded",authorization: "Basic " + base64.Base64.btoa('android_app' + ":" + 'android_app_password')
    }, // 设置请求的 header
    url: server_api_url + 'Token',
    data: {
      grant_type: 'client_credentials' ,
    },
    success: function (result) {
      console.log(result);    //成功返回数据

      wx.setStorageSync('cat', result.data.access_token);
      wx.setStorageSync('cat_expireDate', new Date().getTime() + result.data.expires_in * 1000);
      if (callback) {
        callback();
      }
      // wx.navigateBack({
      //   delta: 1
      // });
      if (!login) {
        is_Usertoken();
      }
      // wx.setStorageSync('cat',res.data.access_token);
    },
    fail: function (res) {
      wx.showToast({
        title: '网络异常，请检查您的网络设置！',
        image: '../pages/images/error_icon.png'
      })
    },
    complete: function (res) {
      // complete
    }
  })
}


//获取用户token(user access_token)
function getUserToken(userInfo) {
  var cat = wx.getStorageSync('cat');
  // console.log(cat);     //拿到全局client access_token
  var code = '';
  wx.login({   // 通过登录获取code
    success: res => {
      code = res.code;
      wx.setStorageSync('code', res.code);
      // console.log(code);
      // wx.request({
      //   header: {
      //     "Content-Type": "application/x-www-form-urlencoded"
      //   },
      //   post:'POST',
      //   url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + '&secret=' + secret + '&code=' + code + '&grant_type=authorization_code',     
      //   success: res => {
      //     console.log(res)   //openid   access_token
      //     wx.setStorage({
      //       key: 'uat',
      //       data: res.data.access_token,
      //       success: function (res) {
      //         // console.log(res);    //存储数据成功
      //         // wx.setStorageSync('uat', res.data.access_token);
      //         // wx.setStorageSync('openid', res.data.openid);
      //         // is_Usertoken();
      //       },
      //     });
      //     wx.setStorage({
      //       key: 'openid',
      //       data: res.data.openid,
      //       success: function (res) {
      //         // console.log(res);    //存储数据成功
      //       },
      //     });
      //   }
      // })
      // wx.getUserInfo({
      //   success: res => {
      //     console.log(res)
      //     var data = res.userInfo;
      //     data.code = code;
      //     data.access_token = cat;
      //     wx.request({
      //       url: server_api_url + "wxlogin/smallProgramLogin?access_token=" + cat,
      //       method: 'POST',
      //       data: data,
      //       success: function (result) {
      //         console.log(result);
      //         if (result.data.code == 1) {
      //           var uat = result.data.data;
      //           wx.setStorage({
      //             key: "uat",
      //             data: uat,
      //             success: function (res) {
      //               wx.setStorageSync('uat', uat);
      //               console.log(res);
      //               wx.setStorageSync('uat_expireDate', new Date().getTime() + 2419200000);
      //             }
      //           });
      //           wx.request({
      //             url: server_api_url + 'user/getUserinfo?access_token=' + uat,
      //             method: 'POST',
      //             success: function (res) {
      //               // console.log(res);
      //               if (res.data.code == 1) {
      //                 var data = res.data.data;
      //                 if (data.verify == 0) {
      //                   wx.reLaunch({
      //                     url: '../bindPhone/bindPhone',
      //                   })
      //                 } else {
      //                 }
      //               }
      //             },
      //             complete: function (res) {
      //             }
      //           })

      //         } else {
      //         }
      //       }
      //     })
      //   },
      //   fail: function () {
      //     console.log('未授权');
      //     if (userInfo) {
      //       wx.openSetting({
      //         success: function (data) {
      //           if (data) {
      //             if (data.authSetting["scope.userInfo"] == true) {
      //             }
      //           }
      //         },
      //         fail: function () {
      //         },
      //         complete: function () {
      //           getUserToken();
      //         }
      //       });
      //     }
      //   }
      // })
    },
    fail: function () {
    }
  });
}
getUserToken();


// 判断token是否有cat
// function is_token() {
//   try {
//     wx.getStorage({
//       key: 'cat',
//       success: function (res) {
//         var value = wx.getStorageSync('cat_expireDate');
//         console.log(value)
//         if (value) {
//           if (new Date().getTime() > value) {
//             getClientToken();
//           }
//         } else {
//           getClientToken();
//         }
//       },
//       fail: function () {
//         getClientToken();
//       },
//       complete: function () {
//         is_Usertoken();
//       }
//     });
//   } catch (e) {
//     console.log(e)
//   }
// }

// 判断cat是否过期
function is_token(login, callback) {
  var cat = wx.getStorageSync('cat');
  // console.log(cat)   //可以获取到
  var value = wx.getStorageSync('cat_expireDate');
  // console.log(value)    
  var is_token = false;
  if (value && cat) {
    if (new Date().getTime() > value) {
      getClientToken(login, callback);
      // return false;
    } else {
      if (!login) {
        is_Usertoken();
      }
      is_token = true;
      if (callback) {
        callback();
      }
    }
  } else {
    getClientToken(login, callback);
    // return false;
  }
  if (!is_token) {
    if (login == false) {
      setTimeout(function () {
        wx.reLaunch({
          url: '/pages/new/maps/maps',
        })
      }, 2000);
    } else if (login == 'login') {

    } else {
      wx.showToast({
        title: 'Token已过期，请重新进入',
        icon: 'none',
      });
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2000);
    }
  }
  return is_token;
}

// 判断是否有uat
function is_Usertoken() {
  // console.log(111)
  try {
    wx.getStorage({
      key: 'uat',
      success: function (res) {
        // console.log(res)   
        var uat = res.data;
        var value = wx.getStorageSync('uat_expireDate');
        if (value && uat) {
          if (new Date().getTime() > value) {
            getUserToken();
          }

        } else {
          getUserToken();
        }
      },
      fail: function (res) {
        getUserToken();
        // console.log('获取用户token');
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  //数据中心服务器api地址
  server_api_url: "https://datacenter.sxzhwts.com/api4/",
  datacenter_api_url: "https://datacenter.sxzhwts.com/",
  server_Redenvelope_url: "https://datacenter.sxzhwts.com/api/",
  server_Redenvelope_urls :"https://datacenter.sxzhwts.com/api4/",
  //票务系统服务器api地址
  ticketserver_api_url: "https://ts.sxzhwts.com/api/",
  ticketserver_api_urls: "https://ts.sxzhwts.com/api4/",
  //酒店服务器api地址
  hotelserver_api_url: "https://hs.sxzhwts.com/api/",
  hotelserver4_api_url: "https://hs.sxzhwts.com/api4/",
  //导游服务器api地址
  guiderserver_api_url: "https://gs.sxzhwts.com/api/",
  //打车服务器api地址
  carserver_api_url: "https://driver.sxzhwts.com/api/",
  //活动api地址
  activeserver_api: "https://apps.sxzhwts.com/api/",
  //图片地址
  photoserver: "https://apps.sxzhwts.com",
  banneserver: "https://datacenter.sxzhwts.com",
  getUserToken: getUserToken,
  getClientToken: getClientToken,
  is_token: is_token,
  is_Usertoken: is_Usertoken
  
}
