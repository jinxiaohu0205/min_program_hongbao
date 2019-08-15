// pages/buy/bus_order_fill/index.js
var WxParse = require('../../../../wxParse/wxParse.js');
var app = getApp();
var coupons_id;
Page({
  data: {
    scenic_id: '',
    cat: '',
    uat: '',
    name: '',
    open_time: '',
    scenictext: [],
    image: '',
    content: '',
    address: '',
    carts:[],
    tab_index: 0,
    state: '',
    article: [],
    jieshao:""
  },
  onLoad: function (options) {
    if (options.coupons_id == "undefined") {
      coupons_id = ""
    } else {
      coupons_id = options.coupons_id
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var scenic_id = options.scenic_id;
    wx.setStorageSync('scenic_id', scenic_id);
    wx.getSetting({
      success(res) {
        if (JSON.stringify(res.authSetting) == "{}") {
          wx.navigateTo({
            url: '../../../author/author'
          })
        }
      }
    })
    var cat = wx.getStorageSync('cat');
    var uat = wx.getStorageSync('uat');
    this.setData({
      scenic_id: options.scenic_id,
      // scenic_id: '751ED38B-9EA2-1F78-3FC5-E779CDB0CCC6',
      cat: cat,
      uat: uat
    })
    this.getViewData();
  },
  onShow: function (options) {
    var that = this;
    var scenic_id = wx.getStorageSync('scenic_id')
    this.setData({
      scenic_id: scenic_id
    });
    var cat = wx.getStorageSync('cat');
    var uat = wx.getStorageSync('uat');
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      that.getViewData();
    })
  },
  bindTab: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      tab_index: index
    });
    var article = this.data.scenictext[index].content;
    var that = this;
    WxParse.wxParse('content', 'html', article, that, 20);
  },
  res: function (e) {
    var a = e.target.id
    var red_envelope = this.data.carts[a].red_envelope
    if (this.data.carts[a].red_envelope==2){
      wx.navigateTo({
        url: '../scenic_fill/scenic_fill?access_token=' + this.data.cat + '&id=' + this.data.scenic_id + '&index=' + e.currentTarget.id + '&coupons_id=' + coupons_id + '&goods_id=' + this.data.carts[a].id + '&red_envelope=' + red_envelope,
      })
    }else{
      if (red_envelope==1){
        wx.navigateTo({
          url: '../scenic_fill/scenic_fill?access_token=' + this.data.cat + '&id=' + this.data.scenic_id + '&index=' + e.currentTarget.id + '&coupons_id=' + "" + '&goods_id=' + this.data.carts[a].id + '&red_envelope=' + red_envelope,
        })
      }else{
        wx.navigateTo({
          url: '../scenic_fill/scenic_fill?access_token=' + this.data.cat + '&id=' + this.data.scenic_id + '&index=' + e.currentTarget.id + '&coupons_id=' + "" + '&goods_id=' + this.data.carts[a].id + '&red_envelope=' + red_envelope,
        })
      }
      
    }
      
  },
  onPullDownRefresh: function () {
    this.getViewData();
  },
  getViewData: function () {
    var that = this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var cat = wx.getStorageSync('cat');
      var uat = wx.getStorageSync('uat');
      wx.request({
        url: app.globalData.publicjs.ticketserver_api_url + 'scenic?scenic_id=' + that.data.scenic_id + '&access_token=' + uat,
        method: 'GET',
        success: function (res) {
          if (res.data.code == 1) {
            var data = res.data.data;
            var state = data.state
            //设置导航条标题
            wx.setNavigationBarTitle({
              title: data.name
            });
            var article = data.scenicext[0].content;
            that.setData({
              name: data.name,
              open_time: data.open_time,
              scenictext: data.scenicext,
              image: data.image,
              address: data.address,
              jieshao: article
            });
            WxParse.wxParse('content', 'html', article, that, 30);
            wx.hideLoading();
          } else {
            wx.showToast({
              title: res.data.message,
              image: '/img/warn_icon.png',
              success: function (res) { }
            })
          }
          that.setData({
            state: state
          });
        },
        fail: function (res) {
          wx.showToast({
            title: '请求出错请重试',
            image: '/img/error_icon.png',
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        },
        complete: function (res) {
          wx.stopPullDownRefresh();
        },
      });

      //获取票种列表
      wx.request({
        url: app.globalData.publicjs.ticketserver_api_url + 'scenic/wxticketes_red?scenic_id=' + that.data.scenic_id + '&access_token=' + uat + '&coupons_id=' + coupons_id,
        method: 'GET',
        // header: {}, // 设置请求的 header
        success: function (res) {
          if (res.data.code == 1) {
            var data = res.data.data.detail;
            var carts = [];
            for (var i = 0; i < data.length; i++) {
              carts.push({ id: data[i].id, name: data[i].name, price: data[i].price, red_envelope: data[i].red_envelope, enable: data[i].enable })
            }
            that.setData({
              carts: carts
            });
          } else {
            
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '请求出错请重试',
            image: '/img/error_icon.png',
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      });
    })
 
  },
  onShareAppMessage: function () {//转发
    return {
      title: "朝台票预定",
      imageUrl: this.data.image
    }
  }
})