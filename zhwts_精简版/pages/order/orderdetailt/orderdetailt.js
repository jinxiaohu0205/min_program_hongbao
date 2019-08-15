var commentjs = require('../../../commentJs/comment.js');

var app = getApp();
Page({
  data: {
    orderid: '',
    tel: '',
    count: '',
    address: '',
    breakfast: '',
    createtime: '',
    orderstate: '',
    amount: '',
    old_amount:'',
    ordercode: '',
    state: 9,
    statevalue: '',
    statevaluet: '',
    statevaluecon: '',
    geter_name:'',
    geter_tel:'',
    scenic_id:'',
    dicounttext:'',
    id:'',
    mingxi: "",
    validate_code:"",
    enable_refund:"",
    mingxiarr:[],
    remark:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderid = options.order_id;
    var that = this;
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
        url: app.globalData.publicjs.ticketserver_api_url + 'user/neworder',     //票
        method: 'post',
        data: {
          access_token: uat,
          order_id: orderid
        },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          var data = res.data.data;
          var state = Number(data.state);    //订单状态
          var validate_code = data.validate_code
          var enable_refund = data.scenic.enable_refund
          that.setData({
            state: state,
            validate_code: validate_code,
            mingxiarr: data.orderDetails
          })
          if (state == 1) {
            that.setData({
              statevalue :"待确认",
              statevaluet : "支付成功",
              statevaluecon : "商家确认中，请耐心等待"
            })
          } else if (state == 2) {
            that.setData({
              statevalue :"待取票",
            statevaluet :"待取票",
              statevaluecon :"订单已确认，待取票"
            })
          } else if (state ==3) {
            that.setData({
              statevalue :"退票审核中",
            statevaluet :"退票审核中",
              statevaluecon :"系统正在审核中，请耐心等待"
            })
          } else if (state ==4) {
            that.setData({
              statevalue :"退票审核通过",
            statevaluet :"退票审核通过",
              statevaluecon :"退款已完成",
            })
          } else if (state ==5) {
            that.setData({
              statevalue :"已使用",
            statevaluet :"已使用",
              statevaluecon :"订单已核销"
            })
          } else if (state ===8) {
            that.setData({
              statevalue :"已关闭",
              statevaluet :"已关闭",
              statevaluecon :"订单已关闭"
            })
          } else if (state ==9) {
            that.setData({
              statevalue :"已取消",
            statevaluet :"已取消",
              statevaluecon :"订单已取消"
            })
          } else if (state ==0) {
            that.setData({
              statevalue :"未支付",
              statevaluet :"等待支付",
              statevaluecon :"建议您在30分钟完成支付"
            })
          }
          var createtime= commentjs.dateformat(new Date(data.create_time * 1000), 'yyyy-MM-dd HH:mm:ss')
          if (data.red_package_id == "") {
            that.setData({
              enable_refund: enable_refund,
              name: data.scenic.name,
              id: data.id,
              tel: data.scenic.telephone,
              geter_name: data.geter_name,
              geter_tel: data.geter_tel,
              orderdetails: data.orderDetails,
              scenic_id: data.scenic_id,
              address: data.scenic.address,
              ordercode: data.order_code,
              createtime: createtime,
              orderstate: data.pay_state,
              amount: data.amount,
              old_amount: data.old_amount,
              dicounttext: '没有使用优惠券',
              remark: data.remark
            })
          } else {
            that.setData({
              id: data.id,
              enable_refund: enable_refund,
              name: data.scenic.name,
              tel: data.scenic.telephone,
              geter_name: data.geter_name,
              geter_tel: data.geter_tel,
              orderdetails: data.orderDetails,
              scenic_id: data.scenic_id,
              address: data.scenic.address,
              ordercode: data.order_code,
              createtime: createtime,
              orderstate: data.pay_state,
              amount: data.amount,
              old_amount: data.old_amount,
              mingxi: data.amount + "=" + data.old_amount + "-" + data.coupon_amount,
              remark: data.remark
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
              url: app.globalData.publicjs.ticketserver_api_url + 'order/cancelOrder',
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  pay: function () {
    wx.navigateTo({
      url: '../../new/scenic/scenicpay/scenicpay?ticket_type=scenic&order_id=' + this.data.id,
    })
  },
  shenqtui:function(){
    wx.navigateTo({
      url: '../../new/tui/tui?order_id=' + this.data.id+'&type='+this.data.type,
    })
  },
  gobuy:function(){
    var cat = wx.getStorageSync('cat');
    wx.navigateTo({
      url: '../../new/scenic/scenic_details/scenic_details?access_token=' + cat + '&scenic_id=' + this.data.scenic_id ,
    })
  }
})