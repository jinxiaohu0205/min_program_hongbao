var commentjs = require('../../../commentJs/comment.js');

var app=getApp();
Page({
  data: {
    orderid:'',
    username:'',
    tel:'',
    formdate:'',
    enddate:'',
    count:'',
    day_count:'',
    hotelname:'',
    hotelid:'',
    address:'',
    createtime:'',
    amount:'',
    old_amount:'',
    ordercode:'',
    state:'',
    statevalue:'',
    statevaluet:'',
    statevaluecon:'',
    discount:'',
    dicounttext:'',
    statetype: '',
    type:'',
    start_date:'',
    end_date:'',
    mingxi:"",
    iscomment:"0",
    latitude:"",
    longitude:"",
    room_type_name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderid = options.order_id;
    var type="";
    if (options.type){
      type = options.type
    }else{
      type =""
    }
    var uat=wx.getStorageSync('uat');
    var that=this;
    that.setData({
      type:type,
      orderid:orderid
    })
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
      start_date: start_date,
      end_date: end_date
    });
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat =wx.getStorageSync('uat');
      wx.request({
        url: app.globalData.publicjs.hotelserver_api_url + 'order/neworderdetail',     //酒店
        method: 'post',
        data: {
          access_token: uat,
          order_id: orderid
        },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          var data = res.data.data;
          var state = data.state;    //订单状态
          var statetype = true;
          that.setData({
            state: state,
            iscomment: data.is_comment
          })
          if (state == 1) {
            that.setData({
              statevalue: "待确认",
              statevaluet: "支付成功",
              statevaluecon: "商家确认中，请耐心等待"
            })
          } else if (state == 2) {
            that.setData({
              statevalue: "等待入住",
              statevaluet: "等待入住",
              statevaluecon: "订单已确认，等待入住"
            })
          } else if (state == 3) {
            that.setData({
              statevalue: "退款审核中",
              statevaluet: "退款审核中",
              statevaluecon: "系统正在审核中，请耐心等待"
            })
          } else if (state == 4) {
            that.setData({
              statevalue: "退票审核通过",
              statevaluet: "退票审核通过",
              statevaluecon: "退款已完成",
            })
          } else if (state == 5) {
            that.setData({
              statevalue :"已使用",
            statevaluet :"已使用",
              statevaluecon :"订单已核销"
            })
          } else if (state == 8) {
            that.setData({
              statevalue: "已关闭",
              statevaluet: "已关闭",
              statevaluecon: "订单已关闭"
            })
            statetype = false;
          } else if (state == 9) {
            that.setData({
              statevalue: "已取消",
              statevaluet: "已取消",
              statevaluecon: "订单已取消"
            })
            statetype = false;
          } else if (state == 10) {
            that.setData({
              statevalue : "已离店",
              statevaluet : "已离店",
              statevaluecon : "订单已完成"
            })
            statetype = false;
          } else if (state == 0) {
            that.setData({
              statevalue : "未支付",
              statevaluet : "等待支付",
              statevaluecon : "支付成功后，房间将为您保留到离店当天的中午12点。"
            })
          }
          
          if (data.red_package_id == "") {
            that.setData({
              username: data.username,
              tel: data.get_tel,
              formdate: commentjs.dateformat(new Date(data.from_date * 1000), 'yyyy-MM-dd'),
              enddate: commentjs.dateformat(new Date(data.end_date * 1000), 'yyyy-MM-dd'),
              count: data.count,
              day_count: data.day_count,
              hotelname: data.hotel.name,
              hotelid: data.hotel_id,
              room_type_name: data.room_type_name,
              address: data.hotel.address,
              latitude: data.hotel.latitude,
              longitude: data.hotel.longitude,
              //roomname: data.roomtype.name,
              ordercode: data.order_code,
              orderid: data.id,
              createtime: commentjs.dateformat(new Date(data.create_time * 1000), 'yyyy-MM-dd HH:ss'),
              amount: data.amount,
              old_amount: data.old_amount,
              state: state,
              statetype: statetype,
              dicounttext: '没有使用优惠券',
              mingxi: data.amount + "=" + data.old_amount + "-" + data.coupon_amount
            })
          } else {
            that.setData({
              username: data.username,
              tel: data.get_tel,
              formdate: commentjs.dateformat(new Date(data.from_date * 1000), 'yyyy-MM-dd'),
              enddate: commentjs.dateformat(new Date(data.end_date * 1000), 'yyyy-MM-dd'),
              count: data.count,
              day_count: data.day_count,
              hotelname: data.hotel.name,
              latitude: data.hotel.latitude,
              longitude: data.hotel.longitude,
              room_type_name: data.room_type_name,
              hotelid: data.hotel_id,
              address: data.hotel.address,
              ordercode: data.order_code,
              orderid: data.id,
              createtime: commentjs.dateformat(new Date(data.create_time * 1000), 'yyyy-MM-dd HH:ss'),
              amount: data.amount,
              statetype: statetype,
              old_amount: data.old_amount,
              mingxi: data.amount + "=" + data.old_amount + "-" + data.coupon_amount
            })
            if (data.red_package) {
              if (data.red_package.type == 0) {
                that.setData({
                  dicounttext: '使用' + data.red_package.discount / 10 + '折优惠券'
                })
              } else if (data.red_package.type == 1) {
                that.setData({
                  dicounttext: '使用' + data.red_package.money + '元减价券'
                })
              } else if (data.red_package.type == 2) {
                that.setData({
                  dicounttext: '使用' + data.red_package.money + '元固定金额券'
                })
              }
            } else {
              that.setData({
                dicounttext: ''
              })
            }
          }
        }
      })
    })
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
  },
  cancelorder: function () {
    var that = this;

    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要取消订单吗？',
      success(res) {
        if (res.confirm) {
          //验证cat过期没有
          app.getToken().then(function (res) {
            //这里说明就存上了cat
          })
          //验证uat过期没有
          app.getTokenUat().then(function (res) {
            //这里说明就存上了uat
            var uat = wx.getStorageSync('uat');
            wx.request({
              url: app.globalData.publicjs.hotelserver_api_url + 'order/hotel_cancel_order',
              method: 'post',
              data: {
                access_token: uat,
                order_id: that.data.orderid
              },
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              success: function (res) {
                wx.showToast({
                  title: '订单已取消',
                  icon: 'succes',
                  duration: 1000,
                  mask: true,
                  complete: function () {
                    wx.navigateTo({
                      url: '../../new/me/order_list/order_list?type=0&state=0'
                    })
                  }
                })
              }
            })
          })
        } else if(res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  pay:function(){
    wx.navigateTo({
      url: '../../new/hotel/hotelpay/hotelpay?ticket_type=hotel&order_id=' + this.data.orderid,
    })
  },
  shenqtui: function () {
    wx.navigateTo({
      url: '../../new/tui/tui?order_id=' + this.data.orderid + '&type=' +'hotel_order_detail',
    })
  },
  gobuy: function () {
    var cat = wx.getStorageSync('cat');
    wx.navigateTo({
      url: '../../new/hotel/hotel_details/hotel_details?access_token=' + cat + '&hotel_id=' + this.data.hotelid + '&starttime=' + this.data.start_date + '&endtime=' + this.data.end_date,
    })
  },
  toGo: function () {//导航
    var that = this;
    wx.getLocation({//获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: Number(that.data.latitude),//要去的纬度-地址
          longitude: Number(that.data.longitude),//要去的经度-地址
          name: that.data.hotelname,
          address: that.data.address
        })
      },
      fail:function(res){
        wx.showToast({
          title: '请打开手机定位',
        })
      }
    })
  }
})