// pages/new/hongbao_history/hongbao_history.js
var commentjs = require('../../../commentJs/comment.js');
const app = getApp();
Page({
  data: {
    red_envelope_id:'',
    page:1,
    name:'',
    image:'',
    count:'',
    red_message: '',
    red_list: [],
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      red_envelope_id: options.red_envelope_id
    });
    this.getViewData();
  },
  onPullDownRefresh: function () {
    this.setData({
      red_message: [],
      page: 1
    });
    this.getViewData();
  }, 
  onReachBottom: function () {
    var page = this.data.page + 1;
    this.setData({
      page: page
    });
    this.getViewData();
  },
  getViewData: function (e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    var cat = wx.getStorageSync('cat');
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat = wx.getStorageSync('uat');
      // 红包领取人数
      wx.request({
        url: app.globalData.publicjs.server_Redenvelope_url + 'Redenvelope/red_receive_list?access_token=' + uat + '&red_envelope_id=' + that.data.red_envelope_id + '&page=' + that.data.page,
        method: 'GET',
        success: function (res) {
          var data = res.data.data.list.data;
          console.log(data);
          var name = res.data.data.name;
          var image = res.data.data.image;
          var count = res.data.data.count;
          var red_list = that.data.red_list;
          for (var i = 0; i < data.length; i++) {
            var red_message = {};
            if (data){
              red_message.create_time = commentjs.dateformat(new Date(data[i].create_time * 1000), 'MM月dd日 hh:mm:ss');
              red_message.headimgurl = data[i].headimgurl;
              red_message.nickname = data[i].nickname;
              red_message.red_money = data[i].red_money;
              red_list.push(red_message);
            }
          }
          if (that.data.page == 1) {
            that.setData({
              red_message: []
            });
          }
          that.setData({
            red_message: red_list,
            name: name,
            image: image,
            count: count
          });
        }, complete: function () {
          wx.hideLoading();
          wx.stopPullDownRefresh();
        }
      })
    })
  }
})