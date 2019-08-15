// pages/new/me/me_index/me_index.js
const app = getApp();
Page({
  data: {
    headimgurl: '',
    nickname: '',
    amount:'',
    quannum:'',
    wentishow:false,
    lianxishow:false,
    top:"400",
    left:"200"
  },
  onLoad: function (options) {
    wx.getSetting({
      success(res) {
        if (JSON.stringify(res.authSetting) == "{}") {
          wx.navigateTo({
            url: '../../../author/author'
          })
        }
      }
    })
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
        url: app.globalData.publicjs.server_Redenvelope_urls + 'user/getUserinfo',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat
        },
        success: function (res) {
          var amount = res.data.data.red_envelope;
          var quannum = res.data.data.coupon_count;
          var nickname = res.data.data.nickname;
          var headimgurl = res.data.data.headimgurl;
          that.setData({
            amount: amount,
            quannum: quannum,
            nickname: nickname,
            headimgurl: headimgurl
          })
        }
      })
    })
  },  
  onShow:function(){
    this.onLoad()
  },
  lookcore: function () {
    wx.navigateTo({
      url: '../hongbao_core/hongbao_core',
    })
  },
  lookorder:function(){
    wx.navigateTo({
      url: '../order_list/order_list?type=0&state=0',
    })
  },
  mylin:function(){
    wx.navigateTo({
      url: '../hongbao_core/hongbao_core?currentTab=0'
    })
  },
  myquan:function(){
    wx.navigateTo({
      url: '../hongbao_core/hongbao_core?currentTab=1',
    })
  },
  women:function () {
    wx.navigateTo({
      url: '../women/women',
    })
  },
  wenti: function () {
    wx.navigateTo({
      url: '../wenti/wenti',
    })
  },
  lianxi:function () {
    var lianxishow = !this.data.lianxishow;
    this.setData({
      lianxishow: lianxishow
    })
  },
  close:function () {
    this.setData({
      lianxishow: false
    })
  },
  showcall: function () {
    wx.showModal({
      content: '您确定要拨打客服电话吗？',
      showCancel: true,//是否显示取消按钮
      confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          wx.makePhoneCall({
            phoneNumber: "400-0350-577",
          })
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },
  xiazai:function(){
    wx.navigateTo({
      url: '../app/app',
    })
  }
})