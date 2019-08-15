var commentjs = require('../../../../commentJs/comment.js');
var app=getApp();
Page({
  data: {
    is_redpack: true,
    showview: true,
    name:'',
    typename:'',
    discount:'',
    type: '',
    money:'',
    items:[],
    all_coupon: [],
    id:'',
    endtime:'',
    couponmess:""
  },

  onLoad: function (options) {
    var type_id = options.type_id;
    var goods_id=options.goods_id;
    // var showview= options.showview;
    var that = this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat = wx.getStorageSync('uat');
      wx.request({
        // http://datacenter.sxzhwts.com/api/Redenvelope/user_coupon
        url: app.globalData.publicjs.datacenter_api_url + 'api/Redenvelope/user_coupon',
        method: 'GET',
        data: {
          access_token: uat,
          type_id: type_id,
          goods_id: goods_id
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.data.length == 0) {
            console.log('没有优惠券');
            var showview = false;
            that.setData({
              showview: showview,
            })
          } else {
            var items = res.data.data;
            var all_coupon = [];
            for (let i = 0; i < items.length; i++) {
              var coupon = items[i];
              var coupon_data = {};
              var typename = '';
              var couponmess = '';
              coupon_data.discount = coupon.discount / 10;     //打折
              coupon_data.discount_num = coupon.discount / 100;
              coupon_data.image = coupon.image;    //图片 
              coupon_data.money = coupon.money;    //钱
              coupon_data.name = coupon.name;    //房间名字
              coupon_data.type = coupon.type;    //红包类型
              coupon_data.buy_limit = coupon.buy_limit; //优惠间数
              coupon_data.house_day = coupon.house_day; //优惠天数
              coupon_data.starttime = commentjs.dateformat(new Date(coupon.use_start_time * 1000), 'yyyy-MM-dd'); //优惠开始时间
              coupon_data.desc = coupon.desc; //优惠活动
              if (coupon.type == 0) {
                typename = "折扣券";
                coupon_data.discount = coupon.discount / 10;
                couponmess = coupon_data.discount;
              } else if (coupon.type == 1) {
                typename = "优惠券";
                couponmess = coupon_data.money;
              } else if (coupon.type == 2) {
                typename = "固定金额券";
                couponmess = coupon_data.money.slice(0, 3);
              }
              coupon_data.couponmess = couponmess;
              coupon_data.typename = typename;
              coupon_data.id = coupon.id;    //id
              coupon_data.endtime = commentjs.dateformat(new Date(coupon.use_end_time * 1000), 'yyyy-MM-dd');
              all_coupon.push(coupon_data);
            }

            that.setData({
              all_coupon: all_coupon
            });
          }
        }
      })
    })
 
  },

  shiyong:function(e){    //确定优惠券
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2];
      beforePage.changeData({
        couponid: e.currentTarget.dataset.item.id,//当前优惠券id
        name: e.currentTarget.dataset.item.name,
        money: e.currentTarget.dataset.item.money,
        discount: e.currentTarget.dataset.item.discount,
        coupontype: e.currentTarget.dataset.item.type,
      })
      wx.navigateBack({ 
        success: function () {
          beforePage.changeid(e.currentTarget.dataset.item.id); // 执行前一个页面的onLoad方法
        }
      })
    }
  }

})