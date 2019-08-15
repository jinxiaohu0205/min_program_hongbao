// pages/new/scenic/scenic_fill/scenic_fill.js
// pages/scenic/scenic_fill/scenic_fill.js
var commentjs = require('../../../../commentJs/comment.js');
var app = getApp();
var coupons_id;
var envelope;
var goods_id;
var redEnvelope = 0;
Page({
  data: {
    id: '',
    kefu: '4000350577',
    data_index: '',
    cat: '',
    carts: [],
    is_btn: 'disabled',
    total: 0,
    amount: 0,
    deadline:"",
    count: 0,
    date_start: commentjs.dateformat(new Date(), 'yyyy-MM-dd'),
    end_start: commentjs.addDate(new Date(), 30, 'yyyy-MM-dd'),
    date: commentjs.dateformat(new Date(), 'yyyy-MM-dd'),
    id_card: '',
    phone: '',
    nickname: '',
    phone_focus: false,
    nickname_focus: false,
    id_card_focus: false,
    is_xuanze: true,
    is_invoices: '0',
    invoices_type: '1',
    invoices_name: '',
    is_indexId: '',
    red_package_id: '',
    ten: 10.00,
    red_package_id: '',
    name: '',
    money: '',
    discount: '',
    coupontype: '',
    youmoney: 0,
    amounts: 0,
    total:0.00,
    totals: [],
    remark:"",
    hongbao: {},
    detaileType: "",
    quanname: "",
    hongbaoShow: "",
    hongbaoShow1: "",
    hongbaoEndTime:"",
    num:0,
    coupons_id:"",
    big_chaotai: 0,
    desc: "",
    buy_limit:"",
    hongbaoStartTime:"",
    hongbaoEndTime:"",
    prompt:""
  },
  onLoad: function (options) {
    redEnvelope = options.red_envelope
    goods_id = options.goods_id
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    if (coupons_id == "undefined") {
      coupons_id = ""
    } else {
      coupons_id = options.coupons_id
      this.setData({
        coupons_id: options.coupons_id
      })
    }
    // 页面初始化 options为页面跳转所带来的参数
    var cat = wx.getStorageSync('cat');
    var uat = wx.getStorageSync('uat');
    this.setData({
      id: options.id,
      data_index: 0,
      cat: cat,
      uat: uat,
      is_indexId: options.index
    });
    this.getViewData(coupons_id);
  },
  changeid: function (coupons_id){
    this.getViewData(coupons_id);
    this.setData({
      coupons_id:coupons_id
    })
    
  },
  changeData: function (e) {
    var that=this;
    that.setData({
      name: e.name,
      money: e.money,
      discount: e.discount,
      coupontype: e.coupontype,
      red_package_id: e.couponid,
    });
    // that.sum();
    that.getViewData(coupons_id);
  },
  bindCall: function (e) {
    if (e.currentTarget.id == 'kefu') {
      wx.makePhoneCall({
        phoneNumber: this.data.kefu
      });
    } else {
      wx.makePhoneCall({
        phoneNumber: this.data.hezuo
      });
    }
  },
  // 输入张数
  bindManual: function (e) {
    var index = Number(e.currentTarget.dataset.index);
    // 购物车数据
    var num = e.detail.value;
    if (isNaN(num)) {
      num = 0;
    }
    var carts = this.data.carts;
    carts[index].num = Math.abs(num);
    var that = this;
    that.setData({
      carts: carts
    })
    // that.sum();
  },
  jisuan:function(){
    var carts = this.data.carts;
    var zongjia = 0;
    var that=this;
    var youmoney = 0;
    
    for (let i = 0; i < carts.length; i++) {
      zongjia += carts[i].num * carts[i].price;
      if (carts[i].num != 0) {
        if (that.data.coupontype == '') {
          youmoney=0;
        } else if (that.data.coupontype == 0) {
          if (envelope) {
            if (carts[i].num > envelope.buy_limit) {
              if (carts[i].red_envelope==2){
                youmoney = envelope.buy_limit * carts[i].price - envelope.buy_limit * envelope.discount * carts[i].price / 100
              }
            } else if (envelope.buy_limit == 0) {
              if (carts[i].red_envelope == 2) {
                youmoney = carts[i].num * carts[i].price - carts[i].num * envelope.discount * carts[i].price / 100
              }
            } else {
              if (carts[i].red_envelope == 2) {
                youmoney = carts[i].num * carts[i].price - carts[i].num * envelope.discount * carts[i].price / 100
              }
            }
          }
        } else if (that.data.coupontype == 1) {
          if (envelope) {
            if (carts[i].num > envelope.buy_limit) {
              if (carts[i].red_envelope == 2) {
                var aa = envelope.buy_limit * envelope.money;
                var bb = envelope.buy_limit * carts[i].price;
                if(aa>bb){
                  youmoney=bb
                }else{
                  youmoney=aa
                }
              }
            } else if (envelope.buy_limit == 0) {
              if (carts[i].red_envelope == 2) {
                var aa = envelope.num * envelope.money;
                var bb = envelope.num * carts[i].price;
                if (aa > bb) {
                  youmoney = bb
                } else {
                  youmoney = aa
                }
              }
            } else {
              if (carts[i].red_envelope == 2) {
                var aa = carts[i].num * envelope.money;
                var bb = carts[i].num * carts[i].price;
                if (aa > bb) {
                  youmoney = bb
                } else {
                  youmoney = aa
                }
              }
            }
          }
        } else if (that.data.coupontype == 2) {
          if (envelope) {
            if (carts[i].num > envelope.buy_limit) {
              if (carts[i].red_envelope == 2) {
                youmoney = envelope.buy_limit * carts[i].price - envelope.buy_limit * envelope.money
              }
            } else if (envelope.buy_limit == 0) {
              if (carts[i].red_envelope == 2) {
                youmoney = carts[i].num * carts[i].price -carts[i].num * envelope.money
              }
            } else {
              if (carts[i].red_envelope == 2) {
                youmoney = carts[i].num * carts[i].price -carts[i].num * envelope.money
              }
            }
          }
        }
      }
    }
    var total = zongjia - youmoney

    if (total < 0) {
      total = 0
    }
    if (youmoney < 0) {
      youmoney = 0
    }
    that.setData({    
      amounts: zongjia,
       total: total.toFixed(2),
       youmoney:youmoney.toFixed(2)
    });
  },
  //减
  bindMinus: function (e) {
    var index = Number(e.currentTarget.dataset.index);
    var num = this.data.carts[index].num;
    // 如果只有1件了，就不允许再减了
    if (num > 0) {
      num--;
    } else {
      num = 0;
    }
    // 购物车数据
    var carts = this.data.carts;
    carts[index].num = num;
    // 将数值与状态写回
    var that = this;
    that.setData({
      carts: carts,
    });
    this.jisuan()
  },
  //加
  bindPlus: function (e) {
    var index = Number(e.currentTarget.dataset.index);
    var num = this.data.carts[index].num;
    var price = this.data.carts[index].sum;
    // 自增
    if (num >= 0) {
      num++;
    } else {
      num = 0;
    }
    // 购物车数据
    var carts = this.data.carts;
    carts[index].num = num;
    // 将数值与状态写回
    var that=this;
    that.setData({
      carts: carts,
    });
    this.jisuan()
    
  },
  // 日期变化
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
 
  // 是否同意协议
  bindXuanze: function () {
    var is_xuanze = this.data.is_xuanze;
    if (is_xuanze) {
      this.setData({
        is_xuanze: false
      });
    } else {
      this.setData({
        is_xuanze: true
      });
    }
  },
  // 选择优惠券
  bindnav: function () {
    wx.navigateTo({
      url: '../../hotel/coupon/coupon?type=scenic&type_id=' + this.data.id + '&goods_id=' + goods_id,
    })
  },
  //点击报销票据种类
  bindInvoices_type: function (e) {
    var invoices_type = e.currentTarget.dataset.id;
    this.setData({
      invoices_type: invoices_type
    })
  },
  parameterTap: function (e) {//e是获取e.currentTarget.dataset.id所以是必备的，跟前端的data-id获取的方式差不多
    var that = this;
    var this_checked = e.currentTarget.dataset.id;
    var parameterList = this.data.parameter//获取Json数组
    for (var i = 0; i < parameterList.length; i++) {
      if (parameterList[i].id == this_checked) {
        parameterList[i].checked = true;//当前点击的位置为true即选中
      }
      else {
        parameterList[i].checked = false;//其他的位置为false
      }
    }
    that.setData({
      parameter: parameterList
    })
  },
  // 请求接口
  getViewData: function (coupons_id) {
    var that = this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      //请求票种
      var cat = wx.getStorageSync('cat');
      var uat = wx.getStorageSync('uat');
      wx.request({
        url: app.globalData.publicjs.ticketserver_api_url + 'scenic?scenic_id=' + that.data.id + '&access_token=' + uat,
        method: 'GET',
        success: function (res) {
          if (res.data.code == 1) {
            var data = res.data.data;
            //设置导航条标题
            wx.setNavigationBarTitle({
              title: "准备下单"
            });
            that.setData({
              name: data.name,
              is_invoices: data.is_invoices,
              deadline: data.deadline,
              prompt: data.prompt
            });
            wx.hideLoading();
          } else {
            wx.showToast({
              title: res.data.message,
              image: '/img/warn_icon.png',
              success: function (res) { }
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '请求出错请重试',
            image: '/img/error_icon.png',
            success: function (res) { }
          })
        },
        complete: function (res) {
          // wx.stopPullDownRefresh();
        },
      });

      //获取票种列表
      wx.request({
        url: app.globalData.publicjs.ticketserver_api_url + 'scenic/wxticketes_red?scenic_id=' + that.data.id + '&access_token=' + uat + '&coupons_id=' + coupons_id,
        method: 'GET',
        // header: {}, // 设置请求的 header
        success: function (res) {
          var data = res.data.data.detail;
          var cartss = [];
          var hongbaotime;
          if (res.data.data.red_envelope) {

            var zongjia = 0;
            for (var i = 0; i < data.length; i++) {
              var num = 0;
              if (data[i].red_envelope == 2) {
                if (goods_id == data[i].id) {
                  num = 1
                }
              } else {
                num = 0
              }
              cartss.push({ id: data[i].id, name: data[i].name, price: data[i].price, num: num, red_envelope: data[i].red_envelope, enable: data[i].enable });
            }
            for (var i in cartss) {
              zongjia += cartss[i].price * cartss[i].num
            }
            envelope = res.data.data.red_envelope;
            var hongbaoStartTime = res.data.data.red_envelope.use_start_time
            hongbaotime = res.data.data.red_envelope.use_end_time
            if (that.data.id == '751ED38B-9EA2-1F78-3FC5-E779CDB0CCC6'){
              if (cartss[5].num) {
                var big_chaotai = cartss[5].num
                that.setData({
                  big_chaotai: big_chaotai
                });
              } else {
                var big_chaotai = ""
                that.setData({
                  big_chaotai: big_chaotai
                });
              }
            }
            if (res.data.data.red_envelope.type == 0) {
              var youmoney = 0;
              var a = res.data.data.red_envelope.discount
              for (var i in cartss) {
                if (cartss[i].num == 1) {
                  youmoney += cartss[i].price - cartss[i].price * a / 100
                }
              }
              youmoney = youmoney.toFixed(2)
              var total = (zongjia - youmoney).toFixed(2)
              that.setData({
                num: "",
                money: res.data.data.red_envelope.discount / 10,
                detaileType: "折",
                quanname: "打折券"
              })
            } else if (res.data.data.red_envelope.type == 1) {
              var youmoney = 0;
              for (var i in cartss) {
                if (cartss[i].num == 1) {
                  youmoney += Number(res.data.data.red_envelope.money)
                }
              }
              youmoney = youmoney.toFixed(2)
              var total = (zongjia - youmoney).toFixed(2)
              that.setData({
                num: "",
                money: res.data.data.red_envelope.money,
                detaileType: "元",
                quanname: "减价券"
              })
            } else if (res.data.data.red_envelope.type == 2) {
              var youmoney = 0;
              for (var i in cartss) {
                if (cartss[i].num == 1) {
                  youmoney += cartss[i].price - Number(res.data.data.red_envelope.money)
                }
              }
              youmoney = youmoney.toFixed(2)
              var total = (zongjia - youmoney).toFixed(2)
              that.setData({
                num: "",
                money: res.data.data.red_envelope.money,
                detaileType: "元",
                quanname: "固定金额券"
              })
            }

            if (total < 0) {
              total = 0
            }
            if (youmoney < 0) {
              youmoney = 0
            }
            that.setData({
              carts: cartss,
              total: total,
              youmoney: youmoney,
              amounts: zongjia,
              coupontype: res.data.data.red_envelope.type,
              hongbao: res.data.data.red_envelope,
              hongbaoShow: true,
              hongbaoShow1: false,
              hongbaoStartTime: commentjs.dateformat(new Date(hongbaoStartTime * 1000), 'yyyy-MM-dd'),
              hongbaoEndTime: commentjs.dateformat(new Date(hongbaotime * 1000), 'yyyy-MM-dd'),
              desc: res.data.data.red_envelope.desc,
              buy_limit: res.data.data.red_envelope.buy_limit
            })
          } else {
            that.data.hongbao = "";
            for (var i = 0; i < data.length; i++) {
              var num = 0;
              if (data[i].red_envelope == 2) {
                num = 1
              } else {
                num = 0
              }
              cartss.push({ id: data[i].id, name: data[i].name, price: data[i].price, num: num, red_envelope: data[i].red_envelope, enable: data[i].enable });
            }
            var total = "0.00"
            var youmoney = "0.00"
            if (redEnvelope == 1) {
              that.setData({
                hongbaoShow: false,
                hongbaoShow1: true
              })
            } else {
              that.setData({
                hongbaoShow: false,
                hongbaoShow1: false
              })
            }

            that.setData({
              coupontype: "",
              carts: cartss,
              total: total,
              youmoney: youmoney
            })
          }
        },
      });
    })


  },
  bindOrder: function () {
    coupons_id = this.data.coupons_id
    var that = this;
    if (!this.data.is_xuanze) {
      wx.showToast({
        title: '请勾选同意票务协议',
        icon: 'none'
      });
      return false;
    }
    if (!this.data.nickname) {
      wx.showToast({
        title: '姓名不能为空',
        image: '/img/warn_icon.png',
        success: function (res) {
          that.setData({
            nickname_focus: true
          });
        }
      });
      return false;
    }
    if (!commentjs.is_phone(this.data.phone)) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      });
      return false;
    } else if (this.data.nickname) {
      var str = this.data.nickname
      var reg = /^([\u4e00-\u9fa5]){2,7}$/;
      if (!reg.test(str)) {
        wx.showToast({
          title: '姓名格式不正确',
          icon: 'none'
        });
        return false;
      }
    }
    // 获取系统信息
    var platform = '分销小程序';
    wx.getSystemInfo({
      success: function (res) {
        platform = platform + '-手机品牌：' + res.brand + '-手机型号:' + res.model + '-微信版本号：' + res.version + '-手机系统版本号：' + res.system + '-系统类型：' + res.platform + '-客户端基础库版本库' + res.SDKVersion;
      }
    })

    if (that.data.id == '751ED38B-9EA2-1F78-3FC5-E779CDB0CCC6') {
      that.setData({
        big_chaotai: that.data.carts[5].num
      });
    }
    var uat = wx.getStorageSync('uat');
    var obj = new Object();
    var carts = this.data.carts;
    var detail = new Array();
    obj.access_token = uat;
    obj.scenic_id = this.data.id;
    obj.geter_name = this.data.nickname;
    obj.geter_tel = this.data.phone;
    obj.remark = this.data.remark;
    obj.geter_card_id = this.data.id_card;
    obj.invoices_type = this.data.invoices_type;
    obj.invoices_name = this.data.invoices_name;
    obj.scenic_scenc_id = '0';
    obj.amount = this.data.amounts;
    obj.contacts = [];
    obj.date = this.data.date;
    obj.platform = platform;
    obj.red_package_id = coupons_id;
    obj.big_chaotai = this.data.big_chaotai
    obj.total_price = this.data.total
    var x_ids = ['BB659E41-B1AB-A0DB-B200-DC23AF273FBD', 'DCD7345B-D276-FCA7-2DF5-DAD55A5D5835', '09DC396C-5645-97FC-A661-5375D0601274', 'CE1B6381-BD23-A6BB-264E-38E1ED08FE08', 'E4814ADF-CB6F-15A9-15D2-8C7C711A71FC'];
    for (let i = 0; i < carts.length; i++) {
      var id = carts[i].id;
      var buycount = carts[i].num;
      var price = carts[i].price;

      if (buycount > 0) {
        if (id == "408A8660-49A0-9352-3C3C-65287056C5F1") { //大朝台
          //查找已经
          for (let j = 0; j < x_ids.length; j++) {
            var ticket = '';
            for (let n = 0; n < carts.length; n++) {
              if (carts[n].id == x_ids[j]) {
                ticket = carts[n];
                break;
              }
            }
            var exist = false;

            for (let o = 0; o < detail.length; o++) {
              var val = detail[o];
              if (val.ticket_type_id == x_ids[j]) {
                exist = true;
                val.count = Number(val.count) + Number(buycount);
                val.amount = val.amount + parseFloat(ticket.price) * buycount;
                break;
              }
            }
            if (!exist) {
              detail.push({ ticket_type_id: ticket.id, count: buycount, amount: parseFloat(ticket.price) * buycount });
            }
          }
        } else {
          detail.push({ ticket_type_id: id, count: buycount, amount: parseFloat(price) * buycount });
        }
      }
    }
    for (let i = 0; i < detail.length; i++) {
      obj['detail[' + i + '][ticket_type_id]'] = detail[i].ticket_type_id;
      obj['detail[' + i + '][count]'] = detail[i].count;
      obj['detail[' + i + '][amount]'] = detail[i].amount;
      obj['detail[' + i + '][amount]'] = obj['detail[' + i + '][amount]'].toFixed(2);
    }
    //设置是否可提交
    this.setData({
      is_btn: 'disabled'
    });
    setTimeout(function () {
      that.setData({
        is_btn: false
      });
    }, 2000);
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat = wx.getStorageSync('uat');
      obj.access_token = uat;
      //提交订单
      wx.request({
        url: app.globalData.publicjs.ticketserver_api_urls + "Order/save",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST',
        data: obj,
        success: function (res) {
          if (res.data.code == 1) {
            var data = res.data.data;
            wx.showToast({
              title: '提交成功',
            });
            if (res.data.status == 1) {
              wx.redirectTo({
                url: '../../hotel/paysuccess/paysuccess?order_id=' + res.data.data + '&dingdantype=scenic',
              })
            } else if (res.data.status == 0) {
              wx.redirectTo({
                url: '../scenicpay/scenicpay?order_id=' + data + '&type=scenic',
              })
            }

          } else {
            wx.showToast({
              title: res.data.message,
              image: '/img/warn_icon.png',
              duration: 3000
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '提交失败请重试',
            image: '/img/error_icon.png',
          })
        }
      })
    })

  },
  bindInput: function (res) {
    var input = res.target.id;
    var val = res.detail.value;
    switch (input) {
      case "nickname":
        this.setData({
          nickname: val
        });
        break;
      case "id_card":
        this.setData({
          id_card: val
        });
        break;
      case "phone":
        this.setData({
          phone: val
        });
        break;
      case "remark":
        this.setData({
          remark: val
        });
        break;
      case "invoices_name":
        this.setData({
          invoices_name: val
        });
    }
  }
})