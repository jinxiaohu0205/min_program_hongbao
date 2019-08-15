var commentjs = require('../../../../commentJs/comment.js');

var app=getApp();
var dingdantype="";
Page({
  data: {
    orderid:'',
    id:'',
    name:'',
    image:'',
    price:'',
    device0:'',
    device1:'',
    device2:'',
    hotel_room:[]
  },

  onLoad: function (options) { 
    if (options.dingdantype){
      dingdantype = options.dingdantype
    }else{
      dingdantype=""
    }
    var orderid = options.order_id;
    var that=this;
    that.setData({
      orderid: orderid
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
        url: app.globalData.publicjs.hotelserver_api_url + '/hotel1/hotelsearch',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          latitude: '',
          longitude: '',
          hotelname: '',
          rating: '',
          sord: 'default',
          minprice: '0',
          maxprice: '100000',
          page: '1',
          access_token: uat,
        },
        success: function (res) {
          var items = res.data.data.data;
          var hotel_room = [];
          for (let i = 0; i < items.length; i++) {
            var room = items[i];
            var room_data = {};
            room_data.id = room.id;
            room_data.price = room.minprice;    //钱
            room_data.name = room.name;    //房间名字
            room_data.image = room.image;    //房间图片
            room_data.device0 = room.device[0];     //wifi
            room_data.device1 = room.device[1];     //wifi
            room_data.device2 = room.device[2];     //wifi
            hotel_room.push(room_data);
          }
          that.setData({
            hotel_room: hotel_room
          });
        }
      })
    })

  },

  lookdetail:function(){   //查看订单
    var uat = wx.getStorageSync('uat');  
    if (dingdantype =="scenic"){
      wx.navigateTo({
        url: '../../../order/orderdetailt/orderdetailt?order_id=' + this.data.orderid,
      })
    } else {
      wx.navigateTo({
        url: '../../../order/orderdetail/orderdetail?order_id=' + this.data.orderid + '&type=hotel_order_detail',
      })
    }
    
  },

  backindex:function(){     //返回首页
    wx.switchTab({
      url: '../../maps/maps',
    });
  },

  goyu:function(e){
    var index = Number(e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '../hotel_detail/hotel_detail?&hotel_id=' + this.data.hotel_room[index].id + '&starttime=' + app.globalData.start_date + '&endtime=' + app.globalData.end_date,
    })
  }
})