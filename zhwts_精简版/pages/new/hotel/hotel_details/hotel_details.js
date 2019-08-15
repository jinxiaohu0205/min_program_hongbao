var commentjs = require('../../../../commentJs/comment.js');
var Moment = require("../../../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();
var app = getApp();
var coupons_id;
Page({
  data: {
    list:[],
    id:'',
    name: '',
    image: '',
    address: '',
    hotel_room: [],
    hotel_id: '',
    start_date: '',
    end_date: '',
    min_date: '',
    end_min_date: '',
    max_date: '',
    day: '',
    latitude: '',
    longitude: '',
    numdata:'',
    tel:'',
    startdate:'',
    enddate:'',
    display:"none",
    roomstatus:[],
    d_bed_size: "",
    d_break: "",
    d_id: "",
    d_image: "",
    d_name: "",
    d_square: "",
    d_state: "",
    d_wifi: "",
    open_year:"",
    introShow:false
  },
  onLoad: function (options) {
    var hotel_id = options.hotel_id;
    wx.setStorageSync('hotel_id', hotel_id);
    coupons_id = options.coupons_id;
    wx.setStorageSync('coupons_id', coupons_id);
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
    var date = new Date();
    var min_date = commentjs.dateformat(date, 'yyyy-MM-dd');
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

    var start = start_date;
    var end = end_date;


    var startdate = start.substring(5, 10);
    var start_date = startdate;
    var end_date = end.substring(5, 10);
    var date = new Date();
    var min_date = commentjs.dateformat(date, 'yyyy-MM-dd'); 
    var max_date = commentjs.addDate(date, '90', 'yyyy-MM-dd'); 
    if (!end_date && !start_date) {
      start_date = min_date;
      end_date = commentjs.addDate(date, '1', 'yyyy-MM-dd');
      app.globalData.start_date = start_date;
      app.globalData.end_date = end_date;
    }

    var day = '';
    var days = new Date(end).getTime() - new Date(start).getTime();
    day = parseInt(days / (1000 * 60 * 60 * 24));
    this.setData({
      hotel_id: hotel_id,
      startdate: start,
      enddate: end,
      start_date: start_date,
      end_date: end_date,
      min_date: min_date,
      end_min_date: end_date,
      max_date: max_date,
      day: day
    });
    var that= this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      that.getViewData();
    })
    
  },
  onShow: function (options){
    let getDate = wx.getStorageSync("ROOM_SOURCE_DATE");
    var days = new Date(getDate.checkOutDate).getTime() - new Date(getDate.checkInDate).getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    app.globalData.start_date = getDate.checkInDate;
    app.globalData.end_date = getDate.checkOutDate;
    this.setData({
      checkInDate: getDate.checkInDate,
      checkOutDate: getDate.checkOutDate,
      startdate: getDate.checkInDate,
      enddate: getDate.checkOutDate,
      day: day
    })
    var that=this;
    var hotel_id = wx.getStorageSync('hotel_id')
    this.setData({
      hotel_id: hotel_id
    });
    var coupons_id = wx.getStorageSync('coupons_id')
    var cat = wx.getStorageSync('cat');
    var uat = wx.getStorageSync('uat');
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      that.getViewData();
    })
  },
  introShowBtn:function(){
    this.setData({
      introShow: true
    });
  },
  toGo:function(){
    var that=this;
    wx.getLocation({//获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: Number(that.data.latitude),//要去的纬度-地址
          longitude: Number(that.data.longitude),//要去的经度-地址
          name: that.data.name,
          address: that.data.name
        })
      }
    })
  },
  close:function(){
    this.setData({
      introShow: false
    });
  },
  dianji: function () {
    wx.navigateTo({
      url: '../../calendar/index'
    })
  },
  
  onPullDownRefresh: function () {
    this.getViewData();
  },
  getViewData: function () {      //加载适合的宾馆
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    var uat = wx.getStorageSync('uat');
    wx.request({
      url: app.globalData.publicjs.hotelserver_api_url + 'hotel/detail',
      method: "GET",
      data: { 
        access_token: uat, 
        hotel_id: this.data.hotel_id, 
        starttime: this.data.startdate,
        endtime: this.data.enddate,
        coupons_id: coupons_id
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          });
          return false;
        }
        var data = res.data.data;
        var item = data.roomtype;
        var hotel_room = [];
        for (let i = 0; i < data.roomtype.length; i++) {
          var room = data.roomtype[i];
          var room_data = {};
          room_data.id = room.id;
          room_data.price = room.price;
          room_data.name = room.name; 
          room_data.image = room.image; 
          room_data.bed_count = room.bed_count;
          room_data.bed_size = room.bed_size; 
          room_data.wifi = room.wifi; 
          room_data.people_count = room.people_count;
          room_data.square = room.square; 
          room_data.state = room.state; 
          room_data.devicetype = room.devicetype;
          room_data.has_breakfast = room.has_breakfast; 
          room_data.red_envelope = room.red_envelope; 
          hotel_room.push(room_data);  
        }
        that.setData({
          list: data,
          id:data.id,
          name: data.name,
          image: data.image,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          tel: data.telephone,
          hotel_room: hotel_room,
          open_year: data.open_year,
          intro: data.intro
        });
      },
      complete: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  },
  call:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.tel,
    })
  },
  roomdetail:function(e){
    var that = this;
    that.setData({
      display:"block",
      d_bed_size: e.currentTarget.dataset.item.bed_size,
      d_break : e.currentTarget.dataset.item.has_breakfast,
      d_id : e.currentTarget.dataset.item.id,
      d_image : e.currentTarget.dataset.item.image,
      d_name : e.currentTarget.dataset.item.name,
      d_square: e.currentTarget.dataset.item.square,
      d_state: e.currentTarget.dataset.item.state,
      d_wifi: e.currentTarget.dataset.item.wifi,
      d_yushi: e.currentTarget.dataset.item.devicetype[1].device,
      d_bianli: e.currentTarget.dataset.item.devicetype[0].device
    })
  },
  cha:function(){
    var that=this;
    that.setData({
      display:"none"
    })
  },
  yuding:function(e){
    var index = e.target.dataset.index
    if (this.data.hotel_room[index].state != 0) {
        var a = e.target.dataset.index;
        var bb = this.data.hotel_room[a]
        var red_envelope = bb.red_envelope
        if (bb.red_envelope == 2) {
          var coupons_id = this.data.list.roomtype[a].coupons_id
          if (!this.data.d_id) {
            wx.navigateTo({
              url: '../hotel_fill/hotel_fill?id=' + this.data.hotel_room[e.currentTarget.dataset.index].id + '&name=' + this.data.hotel_room[e.currentTarget.dataset.index].name + '&coupons_id=' + coupons_id + '&red_envelope=' + red_envelope,
            })
          } else {
            wx.navigateTo({
              url: '../hotel_fill/hotel_fill?id=' + this.data.d_id + '&name=' + this.data.d_name + '&coupons_id=' + coupons_id + '&red_envelope=' + red_envelope,
            })
          }
        } else if (bb.red_envelope == 1) {
          var coupons_id = ""
          if (!this.data.d_id) {
            wx.navigateTo({
              url: '../hotel_fill/hotel_fill?id=' + this.data.hotel_room[e.currentTarget.dataset.index].id + '&name=' + this.data.hotel_room[e.currentTarget.dataset.index].name + '&coupons_id=' + coupons_id + '&red_envelope=' + red_envelope,
            })
          } else {
            wx.navigateTo({
              url: '../hotel_fill/hotel_fill?id=' + this.data.d_id + '&name=' + this.data.d_name + '&coupons_id=' + coupons_id + '&red_envelope=' + red_envelope,
            })
          }
        } else {
          if (!this.data.d_id) {
            wx.navigateTo({
              url: '../hotel_fill/hotel_fill?id=' + this.data.hotel_room[e.currentTarget.dataset.index].id + '&name=' + this.data.hotel_room[e.currentTarget.dataset.index].name + '&coupons_id=' + "" + '&red_envelope=' + red_envelope,
            })
          } else {
            wx.navigateTo({
              url: '../hotel_fill/hotel_fill?id=' + this.data.d_id + '&name=' + this.data.d_name + '&coupons_id=' + "" + '&red_envelope=' + red_envelope,
            })
          }
        }
    }
  },
  onShareAppMessage: function () {//转发
    return {
      title: this.data.name+"房间预定",
      imageUrl: this.data.image
    }
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})