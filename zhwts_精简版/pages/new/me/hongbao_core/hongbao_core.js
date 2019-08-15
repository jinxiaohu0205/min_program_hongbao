// pages/new/me/hongbao_core/hongbao_core.js
var commentjs = require('../../../../commentJs/comment.js');
var app = getApp();
var coupons_id;
Page({
  data: {
    tabs:[
      { title:"我的零钱"},
      { title: "我的优惠券" }
    ],
    myquan:[
      { title: "全部" },
      { title: "未使用" },
      { title: "已使用" },
      { title: "已过期" }
    ],
    currentTab: '',
    ziTab:0,
    name:'',
    quanname:'',
    amount:'',
    type:'',
    time:'',
    data_room: [],
    data_quan:[],
    id:'',
    money:'',
    type:'',
    discount:'',
    quanname:'',
    linamount:'',
    endtime:'',
    start_date:'',
    end_date:'',
    page: 1,
    page0:1,
    page1: 1,
    page2: 1,
    num:1,
    scroll_top:0,
    display:'none'
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that=this;
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
    that.setData({
      currentTab:options.currentTab,
      start_date: start_date,
      end_date: end_date
    })
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat = wx.getStorageSync('uat'); 
      wx.request({
        url: app.globalData.publicjs.server_Redenvelope_url + 'user/getuserinfo',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat
        },
        success: function (res) {
          var linamount = res.data.data.red_envelope;
          that.setData({
            linamount: linamount
          })
        }
      })
    })
    var state = '';
    this.redCenter();
    this.getViewData(state,that.data.page);
  },
  onReachBottom: function (e) {
    var that = this;
    if(that.data.currentTab==0){
      var num = that.data.num + 1;
      that.setData({
        num: num,
      });
      that.redCenter();
    }else{
      if (that.data.ziTab==0){
        var page = that.data.page + 1;
        var state = '';
        that.setData({
          page: page,
        });
        this.getViewData(state,that.data.page);
      }else if (this.data.ziTab == 1){
        var page0 = this.data.page0 + 1;
        var state = 0;
        this.setData({
          page0: page0,
        });
        this.getViewData(state,that.data.page0);
      }else if (this.data.ziTab == 2) {
          var page1 = this.data.page1 + 1;
          var state = 1;
          this.setData({
            page1: page1,
          });
          this.getViewData(state, that.data.page1);
        } else if (this.data.ziTab == 3) {
          var page2 = this.data.page2 + 1;
          var state = 2;
          this.setData({
            page2: page2,
          });
          this.getViewData(state, that.data.page2);
        }   
    }
},
  redCenter:function(e){
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that=this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat = wx.getStorageSync('uat');
      wx.request({      //零钱加载
        url: app.globalData.publicjs.server_Redenvelope_url + 'Redenvelope/redCenter',
        method: 'get',
        data: {
          access_token: uat,
          currentTab: 0,
          page: that.data.num
        },
        success: function (res) {
          var item = res.data.data;
          var data_room = that.data.data_room;
          for (let i = 0; i < item.length; i++) {
            var room = item[i];
            var room_data = {};
            if (!('order_name' in room)) {
              room_data.name = '提现'
            } else {
              room_data.name = room.order_name;    //名字
            }
            if (room.state == 0) {
              room_data.state = "提现中"
            } else if (room.state == 1) {
              room_data.state = "已提现"
            } else {
              room_data.state = ""
            }
            room_data.time = commentjs.dateformat(new Date(room.create_time * 1000), 'yyyy-MM-dd HH:mm:ss');    //时间
            room_data.amount = room.amount;    //钱
            room_data.type = room.type;   //类型
            data_room.push(room_data);
          }
          that.setData({
            data_room: data_room,
          });
        }, complete: function () {
          wx.hideLoading();
        }
      })
    })
  },
  getViewData:function(e,i){
    wx.showLoading({
      title: '加载中',
      mask: true
    });
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
        url: app.globalData.publicjs.server_Redenvelope_url + 'Redenvelope/myCoupon',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat,
          currentTab: 1,
          page: i,
          state: e
        },
        success: function (res) {
          var quans = res.data.data;
          if (quans == '') {
            return false;
          }
          var data_quan = that.data.data_quan;
          for (let i = 0; i < quans.length; i++) {
            var quan = quans[i];
            var quan_data = {};
            var quanname = '';
            var buttons = '';
            var imgs = '';
            if (quan.id == "undefined") {
              quan_data.id = '';
            } else {
              quan_data.id = quan.id;    //id
            }
            quan_data.name = quan.name;    //名字
            quan_data.image = quan.image;    //图片
            quan_data.discount = quan.discount / 10;    //折
            quan_data.money = quan.money;    //钱
            quan_data.module = quan.module; //类型
            quan_data.type_id = quan.type_id; //跳转详情id
            quan_data.type = quan.type; //券的类型
            quan_data.buy_limit = quan.buy_limit; //优惠间数
            quan_data.house_day = quan.house_day; //优惠天数
            quan_data.starttime = commentjs.dateformat(new Date(quan.use_start_time * 1000), 'yyyy-MM-dd'); //优惠开始时间
            quan_data.desc = quan.desc; //优惠活动
            quan_data.endtime = commentjs.dateformat(new Date(quan.use_end_time * 1000), 'yyyy-MM-dd');//优惠结束时间
            if (quan.type == 0) {
              quanname = "打折券";
            } else if (quan.type == 1) {
              quanname = "优惠券";
            } else if (quan.type == 2) {
              quanname = "固定金额券";
            }
            if (quan.state == 0) {
              buttons = "立即使用";
              imgs = "https://datacenter.sxzhwts.com/uploads/head/lan1.png"
            } else if (quan.state == 1) {
              buttons = "已使用";
              imgs = "https://datacenter.sxzhwts.com/uploads/head/hui.png";
            } else if (quan.state == 2) {
              buttons = "已过期";
              imgs = "https://datacenter.sxzhwts.com/uploads/head/hui.png";
            }
            quan_data.buttons = buttons;
            quan_data.quanname = quanname;
            quan_data.imgs = imgs;
            quan_data.state = quan.state;
            quan_data.quantype = quan.type;   //类型
            data_quan.push(quan_data);
          }
          that.setData({
            data_quan: data_quan,
          });
        }, complete: function (res) {
          wx.hideLoading();
        }
      })
    })
  },
  //点击切换
  bindTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.index) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.index
      })
    }
  },
  // 切换子
  bindziTab: function (e) {
    this.setData({
      data_quan: [],
    });
    var that = this;
    var uat = wx.getStorageSync('uat'); 
    var display='';
    if (this.data.ziTab === e.currentTarget.dataset.index) {
      return false;
    } else {
      that.setData({
        ziTab: e.currentTarget.dataset.index
      })
    }
    if (e.currentTarget.dataset.index == 0) {
      that.setData({
        page:1
      })
      var state = '';
      that.getViewData(state,that.data.page);
    }else if (e.currentTarget.dataset.index==1){
        that.setData({
          page0: 1,
          display: 'none'
        })
        var state = 0;
        that.getViewData(state, that.data.page0);
    }else if (e.currentTarget.dataset.index == 2) {
        that.setData({
          page1: 1,
          display: 'none'
        })
        var state = 1;
        that.getViewData(state, that.data.page1);
    }else if (e.currentTarget.dataset.index == 3) {
        that.setData({
          page2: 1,
          display: 'none'
        })
        var state = 2;
        that.getViewData(state, that.data.page2);
    }
  } ,
  shenti:function(){
    wx.navigateTo({
      url: '../tipay/tipay',
    })
  },
  shiyong: function (e) {
    var button = e.target.dataset.item.buttons;
    if(button=="立即使用"){
      if (e.target.dataset.item.module == "hotel") {
        wx.navigateTo({
          url: '../../hotel/hotel_details/hotel_details?&hotel_id=' + e.target.dataset.item.type_id + '&starttime=' + this.data.start_date + '&endtime=' + this.data.end_date + '&coupons_id=' + e.target.dataset.item.id,
        })
      } else {
        wx.navigateTo({
          url: '../../scenic/scenic_details/scenic_details?&scenic_id=' + e.target.dataset.item.type_id + '&coupons_id=' + e.target.dataset.item.id,
        })
      }
    }
  }
})