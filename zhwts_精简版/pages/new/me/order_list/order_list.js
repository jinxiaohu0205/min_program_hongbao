var app = getApp();
var commentjs = require('../../../../commentJs/comment.js');
Page({
  data: {
    type: 0,
    state: 0,
    winHeight: '',
    tab_color: [],
    display: 'none',
    order_list: [],
    scroll_top: 0,
    page: '1',
    is_scroll: true,//判断是否有数据可以上拉加载更多,
    order_id:'',
    order_type:'',
    use_date:'',
    state_name:'',
    disabled:false
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    var state = options.state;
    var tab_color = [];
    for (let i = 0; i <= 4; i++) {
      if (i == state) {
        tab_color.push('wts-297cfe');
      }
      tab_color.push('');
    }
    this.setData({
      type: options.type,
      tab_color: tab_color,
      state: state
    });
  },
  onShow:function(){
    //验证cat过期没有
    var that= this;
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      that.getViewData();
    })
    
  },
  //点击切换tab
  bindTab: function (res) {
    if (index == this.data.state) {
      return false;
    }
    this.setData({
      // page: 1,
      is_scroll: true,
      order_list: [],
      scroll_top: 0
    });
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var index = res.currentTarget.dataset.tab;
    var tab_color = [];
    for (let i = 0; i <= 4; i++) {
      if (i == index) {
        tab_color.push('wts-297cfe');
      }
      tab_color.push('');
    }
    this.setData({
      state: index,
      tab_color: tab_color
    });
   
    this.getViewData();
  },

  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      is_scroll: true
    });
    this.getViewData();
  },
  onReachBottom: function () {
    if (this.data.is_scroll) {
      var page = parseInt(this.data.page) + 1;
      this.setData({
        page: page
      });
      this.getViewData();
    }
  },
  getViewData: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    that.data.order_list = [];
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat = wx.getStorageSync('uat');
      // 票的订单
      wx.request({
        url: app.globalData.publicjs.server_api_url + "Order/myorder?access_token=" + uat + "&state=" + that.data.state + "&type=" + that.data.type,
        method: 'GET',
        success: function (res) {
          if (res.data.code == 1) {
            var data = res.data.data;
            if (data.length < 1) {
              that.setData({
                display: 'block'
              });
              return false;
            } else if (data.length < 1) {
              that.setData({
                is_scroll: false
              });
              return false;
            }
            var order = [];
            for (let i = 0; i < data.length; i++) {
              var d = data[i];
              var roomtype = '';
              var order_list = new Object();
              var ticket_type = '', icon = '', color = '', piao_href = '';//票种类型
              var name = '';
              var count = '';
              var piao_type = 'order';
              // otype 1景点门票  3酒店   
              if (d.otype == 1) {
                let n = that.getpiaostate(parseInt(d.state));
                order_list.state_name = n.state_name;
                order_list.state_name_color = n.state_name_color;
                that.setData({
                  state_name: order_list.state_name
                })
                order_list.order_id = d.order_id;
                order_list.use_date = d.date;

                var type_detail = 'scenic_detail';
                name = d.scenic.name;
                order_list.icon = 'icon-jingdianmenpiao';
                order_list.color = '#d3483a';
                order_list.ticket_type = '景点门票';
                order_list.piao_href = 'orderdetailt';
                count = d.count + '张';
              } else if (d.otype == 3) {
                let n = that.getjiustate(parseInt(d.state));
                order_list.state_name = n.state_name;
                order_list.state_name_color = n.state_name_color;
                that.setData({
                  state_name: order_list.state_name
                })
                order_list.order_id = n.order_id;
                var type_detail = 'hotel_detail';
                name = d.hotel.name;
                order_list.icon = 'icon-jingdianmenpiao';
                order_list.color = '#d3483a';
                order_list.ticket_type = '酒店订单';
                order_list.piao_href = 'orderdetail';
                if (d.roomtype == null) {
                  roomtype = '';
                } else {
                  if (d.roomtype.name == null) {
                    d.roomtype.name = '';
                  }
                  roomtype = d.roomtype.name;
                }
                order_list.ticket_name = d.ordername + d.roomtype;
                count = d.count + '间';
              }
              var btn_list = [];
              var btn_text = '';
              var btn_color = '';
              var is_cancel = true;
              var piao_type = 'order';
              order_list.is_cancel = is_cancel;
              order_list.piao_type = piao_type;
              order_list.price = d.amount;
              order_list.name = name;
              order_list.order_id = d.id;
              order_list.order_code = d.order_code;
              if (d.otype == 1) {
                order_list.ordermark = commentjs.dateformat(new Date(d.create_time * 1000), 'yyyy-MM-dd HH:mm');
              } else if (d.otype == 3) {
                order_list.from_date = commentjs.dateformat(new Date(d.from_date * 1000), 'yyyy-MM-dd');
                order_list.end_date = commentjs.dateformat(new Date(d.end_date * 1000), 'yyyy-MM-dd');
              }
              order_list.count = count;
              order.push(order_list);
            }
            var display = '';
            if (!order.length) {
              display = 'block';
            } else {
              display = 'none';
            }
            var order_list_data = that.data.order_list;
            order_list_data = order_list_data.concat(order);
            that.setData({
              display: display,
              order_list: order_list_data,
              order_id: order_list.order_id,
              order_type: order_list.ticket_type,
            });
            wx.hideLoading();
          } else {
            wx.showToast({
              title: res.data.message
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '请求出错请重试',
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        },
        complete: function () {
          wx.hideLoading();
          wx.stopPullDownRefresh();
        }
      });
    })
  },
  getpiaostate: function (type) {
    var state_name = '';
    var state_name_color = '';
    switch (type) {
      case 0:
        state_name = '待支付';
        state_name_color = 'wts-fb9c2b';
        break;
      case 1:
        state_name = '待确认';
        state_name_color = 'wts-d3483a';
        break;
      case 2:
        state_name = '待取票';
        state_name_color = 'wts-fb9c2b';
        break;
      case 3:
        state_name = '退款中';
        state_name_color = 'wts-ddd';
        break;
      case 4:
        state_name = '已退票';
        state_name_color = 'wts-ddd';
        break;
      case 5:
        state_name = '已使用';
        state_name_color = 'wts-fb9c2b';
        break;
      case 8:
        state_name = '已关闭';
        state_name_color = 'wts-fb9c2b';
        break;
      case 9:
        state_name = '已取消';
        state_name_color = 'wts-ddd';
        break;
      case 10:
        state_name = '已离店';
        state_name_color = 'wts-ddd';
        break;
    }
    return { state_name: state_name, state_name_color: state_name_color }
  },
  getjiustate: function (type) {
    var state_name = '';
    var state_name_color = '';
    switch (type) {
      case 0:
        state_name = '待支付';
        state_name_color = 'wts-fb9c2b';
        break;
      case 1:
        state_name = '待确认';
        state_name_color = 'wts-d3483a';
        break;
      case 2:
        state_name = '待入住';
        state_name_color = 'wts-fb9c2b';
        break;
      case 3:
        state_name = '退款中';
        state_name_color = 'wts-ddd';
        break;
      case 4:
        state_name = '已退款';
        state_name_color = 'wts-ddd';
        break;
      case 5:
        state_name = '已使用';
        state_name_color = 'wts-fb9c2b';
        break;
      case 8:
        state_name = '已关闭';
        state_name_color = 'wts-fb9c2b';
        break;
      case 9:
        state_name = '已取消';
        state_name_color = 'wts-ddd';
        break;
      case 10:
        state_name = '已离店';
        state_name_color = 'wts-ddd';
        break;
    }
    return { state_name: state_name, state_name_color: state_name_color }
  }
})