var app=getApp();
Page({
  data: {
    refund_amount:'',
    count:'',
    order_name:'',
    order_code:'',
    reason:'',
    total_fee:'',
    state:'',
    refund_type:''
  },

  onLoad: function (options) {
    var piao=""
    if (options.type){
      piao = options.type
    }
    console.log(piao)
    var uat = wx.getStorageSync('uat');
    var that=this;
    if(piao=="piao"){
      wx.request({//票
        url: app.globalData.publicjs.ticketserver_api_url + 'user/new_refund_order_detail',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat,
          refund_id: options.refundid,
        },
        success: function (res) {
          var refund_amount = res.data.data.refund_amount;
          var count = res.data.data.count;
          var order_name = res.data.data.order_name;
          var order_code = res.data.data.order_code;
          var reason = res.data.data.reason;
          var total_fee = res.data.data.total_fee;
          var state = res.data.data.state;
          var refund_type = res.data.data.refund_type;
          that.setData({
            refund_amount: refund_amount,
            count: count,
            order_name: order_name,
            order_code: order_code,
            reason: reason,
            total_fee: total_fee,
            state: state,
            refund_type: refund_type
          })
        }
      })
    }else{
      wx.request({//酒店
        url: app.globalData.publicjs.hotelserver_api_url + 'order/new_refund_order_detail',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat,
          refund_id: options.refundid,
        },
        success: function (res) {
          var refund_amount = res.data.data.refund_amount;
          var count = res.data.data.count;
          var order_name = res.data.data.order_name;
          var order_code = res.data.data.order_code;
          var reason = res.data.data.reason;
          var total_fee = res.data.data.total_fee;
          var state = res.data.data.state;
          var refund_type = res.data.data.refund_type;
          that.setData({
            refund_amount: refund_amount,
            count: count,
            order_name: order_name,
            order_code: order_code,
            reason: reason,
            total_fee: total_fee,
            state: state,
            refund_type: refund_type
          })
        }
      })
    }
  }
})