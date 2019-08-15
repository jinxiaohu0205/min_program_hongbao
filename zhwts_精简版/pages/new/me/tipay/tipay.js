var commentjs = require('../../../../commentJs/comment.js');

var app=getApp();
Page({
  data: {
    amount:'',
    minmoney:'',
    val:'',
    disable:false
  },
  onLoad:function(){
    var that=this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat = wx.getStorageSync('uat'); 
      wx.request({
        url: app.globalData.publicjs.server_Redenvelope_url+'user/getuserinfo',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat
        },
        success: function (res) {
          console.log(res)
          var amount = parseFloat(res.data.data.red_envelope);
          if (amount == "null") {
            that.setData({
              amount: 0.00
            })
          } else {
            that.setData({
              amount: amount
            })
          }

        }
      })
      wx.request({
        url: app.globalData.publicjs.server_Redenvelope_url + 'redenvelope/reflect_min',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat
        },
        success: function (res) {
          var min = parseInt(res.data.data);
          that.setData({
            minmoney: min
          })
        }
      })
    })
  },
  bindinput: function (e) {
    var text = e.detail.value;
    var that = this;
    var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
    if (reg.test(text)) { //正则匹配通过，提取有效文本
      var text = text.replace(reg, '$2$3$4');
      that.setData({
        val: text,
        disable: false
      })
    } else { //正则匹配不通过，直接清空
      var text = '';
      that.setData({
        val: text,
        disable: false
      })
    }
  },
  suretap:function(){
    this.setData({
      disable: true
    })
    if (this.data.val < this.data.minmoney) {
      wx.showModal({
        title: '提示',
        content: '最低提现金额不少于' + this.data.minmoney+'元',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (this.data.val > this.data.amount) {
      wx.showModal({
        title: '提示',
        content: '提现金额超出总金额',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      var that=this;
      //验证cat过期没有
      app.getToken().then(function (res) {
        //这里说明就存上了cat
      })
      //验证uat过期没有
      app.getTokenUat().then(function (res) {
        //这里说明就存上了uat
        var uat = wx.getStorageSync('uat');
        wx.request({
          //  http://datacenter.sxzhwts.com/api/redenvelope/reflect
          url: app.globalData.publicjs.server_Redenvelope_url + '/redenvelope/reflect',
          method: "post",
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            access_token: uat,
            amount: that.data.val
          },
          success: function (res) {
            console.log(res)
            that.setData({
              disable: true
            })
            wx.navigateTo({
              url: '../tisuccess/tisuccess',
            })
          }
        })
      })
    }
  }
})