var app = getApp();
var commentjs = require('../../../commentJs/comment.js');
Page({
  data: {
    items: [
      { name: '个人原因，行程有变', checked: false },
      { name: '订单信息填写错误/重复订单', checked: false },
      { name: '没注意预订时间限制', checked: false },
      { name: '价格发生变化', checked: false },
      { name: '其他原因', checked: false }
    ],
    piaoarr:[],
    piaoamount:'0.00',
    piaoid:'',
    piaodata:'',
    reason:'',
    reasonmark:'',
    ischecked: true,
    detail:[],
    type:"",
    orderid:'',
    refundid:'',
    amount:'',
    isshow:false
  },

  onLoad: function (options) {
    var uat = wx.getStorageSync('uat');
    var that = this;
    that.setData({
      type:options.type,
      orderid:options.order_id
    })
    if (options.type =="hotel_order_detail"){    //酒店退款页
      wx.request({
        url: app.globalData.publicjs.hotelserver_api_url + 'order/orderdetail',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat,
          order_id: options.order_id,
        },
        success: function (res) {
          var data = res.data.data;
          var piaoarr=[];
          for (var i in res.data.data.detail) {
            var piaodata = res.data.data.detail[i];
            var piao_data = {};
            piao_data.oldamount = piaodata.amount;
            piao_data.id = piaodata.id;
            if (piaodata.refund_id) {
              piao_data.refund_id = piaodata.refund_id;
            } else {
              piao_data.refund_id = ""
            }
            piao_data.name = piaodata.truename;
            piao_data.date = commentjs.dateformat(new Date(piaodata.date * 1000), 'yyyy-MM-dd');
            piao_data.amount = Number(piaodata.amount).toFixed(2);
            piao_data.ischecked = false;
            piaoarr.push(piao_data);
          }
          that.setData({
            piaoarr: piaoarr
          })
        }
      })
    }else{
      wx.request({       //票退款页
        url: app.globalData.publicjs.ticketserver_api_url + 'user/refund_order_detail',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat,
          order_id: options.order_id,
        },
        success: function (res) {
          var data = res.data.data;
          var piaoarr = [];

          for (var i in res.data.data.orderdetail) {
            var piaodata = res.data.data.orderdetail[i];
            var piao_data = {};
            piao_data.oldamount = piaodata.amount;
            piao_data.id = piaodata.id;
            if (piaodata.refund_id) {
              piao_data.refund_id = piaodata.refund_id;
            }else{
              piao_data.refund_id =""
            }

            piao_data.name = piaodata.ticket_type_name.name;
            piao_data.ischecked = false;

            piao_data.enable_refund = piaodata.ticket_type_name.enable_refund;
            if (piaodata.ticket_type_name.refund_single == "0") {//全款
              piao_data.amount = Number(piaodata.amount).toFixed(2);
            } else if (piaodata.ticket_type_name.refund_single == "1"){//部分
              if (piaodata.ticket_type_name.refund_type=="1"){//比例
                piao_data.amount = (Number(piaodata.amount) * Number(piaodata.ticket_type_name.refund_rate)/100).toFixed(2);
              } else if (piaodata.ticket_type_name.refund_type=="0"){//固定金额
                piao_data.amount = piaodata.ticket_type_name.refund_money.toFixed(2);
              }
            }

            piaoarr.push(piao_data);
          }
          that.setData({
            piaoarr: piaoarr
          })
        }
      })
    }
  },
  show:function(){
    var isshow = !this.data.isshow;
    that.setData({
      isshow: isshow
    })
  },
  checkedb:function(e){
    var detail=[]
    var that=this;
    var piaoarr = that.data.piaoarr;
    var index = Number(e.currentTarget.dataset.index);
    var check = piaoarr[index].ischecked;
    if (check){
      check=false
      detail = []
    }else{
      check = true
    }
    var num=0;
    piaoarr[index].ischecked = check
    that.setData({
      piaoarr: piaoarr
    });
    for (var i in that.data.piaoarr) {
      if (that.data.piaoarr[i].ischecked) {
        detail.push(piaoarr[i].id)
        num += Number(that.data.piaoarr[i].amount)
      }
    }
    that.setData({
      detail: detail,
      piaoamount:num.toFixed(2)
    });
  },
  checkedaa: function (e) {
    var detail = []
    var that = this;
    var piaoarr = that.data.piaoarr;
    var index = Number(e.currentTarget.dataset.index);
    that.setData({
      piaoarr: piaoarr
    });
    var num = 0;
    for (var i in that.data.piaoarr) {
      if(i>=index){
        if (that.data.piaoarr[i].refund_id == "") {
          piaoarr[i].ischecked = true
          detail.push(piaoarr[i].id)
          num += Number(that.data.piaoarr[i].amount)
        }
      }else{
        piaoarr[i].ischecked = false
      }
    }
    that.setData({
      piaoarr: piaoarr,
      detail: detail,
      piaoamount: num.toFixed(2)
    });
  },
  checkeda: function (e) {
    var that=this;
    var reason=e.currentTarget.dataset.item.name;
    that.setData({
      reason:reason
    })
  },
  bindTextAreaBlur:function(e){
    var that=this;
    that.setData({
      reasonmark: e.detail.value
    }) 
  },
  tishen: function () {
    var uat = wx.getStorageSync('uat');
    if (this.data.type =="hotel_order_detail"){    //酒店
      if (this.data.reason == "") {
        wx.showToast({
          title: '请选择退款原因',
          icon: 'danger',
          duration: 1000,
          mask: true,
        })
      }else if (this.data.detail.length == 0) {
        wx.showToast({
          title: '请选择退款订单',
          icon: 'danger',
          duration: 1000,
          mask: true,
        })
      } else {
        var that = this;
        wx.request({
          url: app.globalData.publicjs.hotelserver_api_url + 'order/hotel_refund_depart_order',
          method: 'post',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            is_all:"0",
            access_token: uat,
            order_id: that.data.orderid,
            amount: that.data.piaoamount,
            detail: that.data.detail,
            reason: that.data.reason,
            reason_remark: that.data.reasonmark
          },
          success: function (res) {
            if(res.data.code==1){
              var refundid = res.data.data;
              wx.navigateTo({
                url: '../tuidetail/tuidetail?refundid=' + refundid + '&orderid=' + that.data.orderid,
              })
            } else if (res.data.code == 0){
              wx.showToast({
                title: res.data.message,
                icon: 'danger',
                duration: 1000,
                mask: true,
              })
            }
          }
        })
      }
    }else{
      if (this.data.detail.length == 0) {
        wx.showToast({
          title: '请选择退款的票',
          icon: 'danger',
          duration: 1000,
          mask: true,
        })
      } else if (this.data.reason == "") {
        wx.showToast({
          title: '请选择退款原因',
          icon: 'danger',
          duration: 1000,
          mask: true,
        })
      } else {
        var that=this;
        wx.request({
          url: app.globalData.publicjs.ticketserver_api_url + 'user/depart_refund_order',
          method: 'post',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            access_token: uat,
            order_id: that.data.orderid,
            amount: that.data.piaoamount,
            detail: that.data.detail,
            reason: that.data.reason,
            reason_remark: that.data.reasonmark
          },
          success: function (res) {
            if (res.data.code == 1) {
              var refundid = res.data.data;
              wx.navigateTo({
                url: '../tuidetail/tuidetail?refundid=' + refundid + '&type=piao',
              })
            } else if (res.data.code == 0) {
              wx.showToast({
                title: res.data.message,
                type: 'warn',
                icon: 'danger',
                duration: 1000,
                mask: true,
              })
            }
          }
        })
      }
    }
    
    
  },
  call: function () {
    wx.makePhoneCall({
      phoneNumber: "400-0350-577",
    })
  }
})