const app = getApp();
var commentjs = require('../../../commentJs/comment.js');
var coupons_id;
Page({
  onReady:function(e){
    this.audioCtx = wx.createAudioContext('myAudio');
    this.audioCtx.play()
  },
  data: {
    red_envelope_id:'',
    suit_name:'',
    quan:"",
    cat:'',
    uat:'',
    image:'',
    name:'',
    red_money:'',
    type_id:'',
    module:'',
    min_date:'',
    max_date:'',
    start_date:'',
    end_date:'',
    discount:'',
    count:'',
    receive_list:[],
    page:1,
    red_message:'',
    red_list:[],
    value:'',
    val:'',
    endtime:'',
    desc:'',
    starttime:'',
    buy_limit:'',
    house_day:'',
    detaileType:'',
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    disable: false
  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  onLoad: function (options) {
    wx.getSetting({
      success(res) {
        if (JSON.stringify(res.authSetting) == "{}") {
          wx.navigateTo({
            url: '../../author/author'
          })
        }
      }
    })
    var cat = wx.getStorageSync('cat');
    var uat = wx.getStorageSync('uat');
    var date = new Date();
    var min_date = commentjs.dateformat(date, 'yyyy-MM-dd');
    var max_date = commentjs.addDate(date, '90', 'yyyy-MM-dd');
    var start_date = app.globalData.start_date;
    var end_date = app.globalData.end_date;
    if (!end_date && !start_date) {
      start_date = min_date;
      end_date = commentjs.addDate(date, '1', 'yyyy-MM-dd');
      app.globalData.start_date = start_date;
      app.globalData.end_date = end_date;
    }
    start_date = min_date;
    end_date = commentjs.addDate(date, '1', 'yyyy-MM-dd');
    app.globalData.start_date = start_date;
    app.globalData.end_date = end_date;
    this.setData({
      red_envelope_id: options.red_envelope_id,
      cat: cat,
      uat: uat,
      start_date: start_date,
      end_date: end_date
    })
    this.getViewData();
    this.red_package_message();
  },
  onPullDownRefresh: function () {
    this.setData({
      red_message: [],
      page: 1
    });
    this.red_package_message();
  },
  mylin: function () {
    wx.navigateTo({
      url: '../me/hongbao_core/hongbao_core?currentTab=0'
    })
  }, 

  autoMusic: function (e) {
    var that = this;
    that.setData({
      auto: !that.data.auto
    });
    if (that.data.auto) {
      this.audioCtx.pause()
    } else {
      this.audioCtx.play()
    }
  },
  getViewData:function(e){
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
      // 红包金额
      wx.request({
        url: app.globalData.publicjs.server_Redenvelope_url + 'Redenvelope/red_receive',
        method: 'GET',
        data: { access_token: uat, red_envelope_id: that.data.red_envelope_id },
        success: function (res) {
          coupons_id = res.data.data.coupons_id
          if (res.data.code == 1) {
            var data = res.data.data;
            var discount;
            var endtime = commentjs.dateformat(new Date(data.use_end_time * 1000), 'yyyy-MM-dd');
            var starttime = commentjs.dateformat(new Date(data.use_start_time * 1000), 'yyyy-MM-dd');
            var type = data.detaile.type;
            if (type == 0) {
              discount = res.data.data.detaile.discount / 10
              that.setData({
                detaileType: "折",
                quan: "打折券"
              })
            } else if (type == 1) {
              discount = data.detaile.money
              that.setData({
                detaileType: "元",
                quan: "现金抵用券"
              })
            } else if (type == 2) {
              discount = data.detaile.money
              that.setData({
                detaileType: "元",
                quan: "固定金额券"
              })
            }
            that.setData({
              image: data.image,
              name: data.name,
              red_money: data.red_money,
              type_id: data.type_id,
              module: data.module,
              discount: discount,
              endtime: endtime,
              descL: data.detaile.buy_limit,
              buy_limit: data.detaile.buy_limit,
              house_day: data.detaile.house_day,
              starttime: starttime,
              suit_name: data.suit_name
            })
          } else if (res.data.code == 0) {
            wx.showToast({
              title: '已达到最大领取次数',
              icon: 'none',
            });
          }

        }
      })

      // 红包领取人数
      wx.request({
        url: app.globalData.publicjs.server_Redenvelope_url + 'Redenvelope/receive_list?access_token=' + uat + '&red_envelope_id=' + that.data.red_envelope_id,
        method: 'GET',
        success: function (res) {
          var data = res.data.data;
          var receive_list = [];
          var list = data.list.slice(0, 3);
          for (var i = 0; i < list.length; i++) {
            receive_list.push({ headimgurl: list[i].headimgurl, nickname: list[i].nickname })
          }
          that.setData({
            count: data.count,
            receive_list: receive_list
          })
        }
      })
    })
    
 
    
  },
  red_package_message:function(e){
    var that = this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat = wx.getStorageSync('uat');
      // 红包评论消息
      wx.request({
        url: app.globalData.publicjs.server_Redenvelope_url + 'Redenvelope/red_package_message?access_token=' + uat + '&red_envelope_id=' + that.data.red_envelope_id + '&page=' + that.data.page,
        method: 'GET',
        success: function (res) {
          var data = res.data.data;
          var red_list = [];
          for (var i = 0; i < data.length; i++) {
            var red_message = {};
            // if (data)
            red_message.content = data[i].content;
            red_message.create_time = commentjs.dateformat(new Date(data[i].create_time * 1000), 'MM月dd日');
            red_message.headimgurl = data[i].headimgurl;
            red_message.nickname = data[i].nickname;
            red_list.push(red_message);
          }
          if (that.data.page == 1) {
            that.setData({
              red_message: []
            });
          }
          that.setData({
            red_message: red_list
          });
        }, complete: function () {
          wx.hideLoading();
          wx.stopPullDownRefresh();
        }
      })
    })
   
    
  },
  onReady: function () {

  },
  shiyong:function(e){
    if (this.data.module == 'hotel'){
      wx.navigateTo({
        url: '../hotel/hotel_details/hotel_details?access_token=' + this.data.cat + '&hotel_id=' + this.data.type_id + '&starttime=' + this.data.start_date + '&endtime=' + this.data.end_date + '&coupons_id=' + coupons_id,
      })
    }
    if (this.data.module == 'scenic') {
      wx.navigateTo({
        url: '../scenic/scenic_details/scenic_details?access_token=' + this.data.cat + '&scenic_id=' + this.data.type_id + '&coupons_id=' + coupons_id,
      })
    }
    if (this.data.module == 'activity') {

    }
    if (this.data.module == 'guide') {

    }
  },
  contents:function(e){
    this.setData({
      val: e.detail.value
    })
  },
  subm:function(e){
    var that = this;
    if (that.data.val=='') {
      wx.showToast({
        icon:'none',
        title: '评论内容不能为空',
      })
      return false;
    }else{
      this.setData({
        disable: true
      })
      //验证cat过期没有
      app.getToken().then(function (res) {
        //这里说明就存上了cat
      })
      //验证uat过期没有
      app.getTokenUat().then(function (res) {
        //这里说明就存上了uat
        var uat = wx.getStorageSync('uat');
        // 红包评论
        wx.request({
          url: app.globalData.publicjs.server_Redenvelope_url + 'Redenvelope/send_redpackage_message?access_token=' + uat + '&red_envelope_id=' + that.data.red_envelope_id + '&content=' + that.data.val,
          method: 'GET',
          data: { access_token: uat, red_envelope_id: that.data.red_envelope_id },
          success: function (res) {
            that.setData({
              disable: false
            })
            if (res.data.code == 1) {
              wx.showToast({
                title: '评论成功',
                icon: 'none',
              });
            }
            that.setData({
              val: ''
            })
            that.red_package_message();
          }
        })
      })
      
    }
    
  },
  onShareAppMessage: function () {//转发
    return {
      title: "五台山综合性旅游服务平台",
      imageUrl: "img/wutai.png" 
    }
  }
})