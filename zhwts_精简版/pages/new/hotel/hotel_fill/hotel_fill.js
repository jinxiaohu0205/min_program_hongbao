// pages/hotel/hotel_fill/hotel_fill.js
var commentjs = require('../../../../commentJs/comment.js');
var coupons_id;
var app = getApp(); 
var able_house_num;
var youhuiquan;

var amountafter=0;
var youmoney=0;
var roomstatus;
var keyong=false;
var jisuan=true;
var redEnvelope=0;
Page({
  data: {
    kefu: '4000350577',
    hotel_name: '',
    room_name:'',
    roomstatus: [],
    roomstatus_old:[],
    room_id: '',
    hotel_id:'',
    bed_count:'',
    people_count:'',
    has_breakfast:'',
    retentiontime:'',
    square:'',
    start_date: '',
    end_date: '',
    day: '',
    amount:'',
    amountafter:0,
    youmoney:0,
    total:'',
    price:0,
    sale:'',
    buycount:1,
    is_count:'',//一共有多少间房
    people_list: { truename: '', tel: '', },
    is_xuanze:true,
    is_redpack:true,
    // is_other:true,
    is_picc:true,
    name:'',
    discount:'',
    coupontype:'',
    red_package_id:'',
    ten:"10.00",
    pic:'',
    couponid:'',
    hongbao:{},
    detaileType:"",
    quanname:"",
    hongbaoShow:"",
    hongbaoShow1: "",
    hongbaoEndTime:"",
    buy_limit:"",//限制间数
    house_day:"",//限制天数,
    num:"",
    roomstatus:[],
    data:"",
    desc:""
  },

  onLoad: function (options) {
    redEnvelope = options.red_envelope
    if (coupons_id == "undefined"){
      coupons_id= ""
    } else {
      coupons_id = options.coupons_id
    }
    var room_id = options.id;
    var hotel_name = options.name;
    var start_date = app.globalData.start_date;
    var end_date = app.globalData.end_date;
    var day = '';
    var days = new Date(end_date).getTime() - new Date(start_date).getTime();
    day = parseInt(days / (1000 * 60 * 60 * 24));
    this.setData({
      hotel_name: hotel_name,
      room_id: room_id,
      // room_name: room_name,y
      start_date: start_date,
      end_date: end_date,
      day: day
    });
    var that = this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      that.getViewData(coupons_id);
    })
  },
  onShow:function(){
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
    })
  },
  changeid: function (coupons_id) {
    //验证cat过期没有
    var that = this;
    app.getToken().then(function (res) {
      //这里说明就存上了cat
      that.getViewData(coupons_id);
    })
  },
  changeData: function (e) {
    this.setData({
      name: e.name,
      money:e.money,
      discount:e.discount,
      coupontype:e.coupontype,
      couponid: e.couponid,
    });
    //验证cat过期没有
    var that = this;
    app.getToken().then(function (res) {
      //这里说明就存上了cat
      that.getViewData(coupons_id);
    })
  },
  bindinput: function (e) {
    this.data.people_list.truename = e.detail.value
  },
  bindinput1: function (e) {
    this.data.people_list.tel = e.detail.value
  },
  getViewData: function (coupons_id) {
    var that = this;
    var cat = wx.getStorageSync('cat');
    wx.request({
      url: app.globalData.publicjs.hotelserver_api_url + 'hotel1/roomdetail',
      method: "GET",
      data: {
        access_token: cat,
        room_type_id: this.data.room_id,
        starttime: this.data.start_date,
        endtime: this.data.end_date,
        coupons_id:coupons_id
      },
      success: function (res) {
        if(res.data.code==0){
          wx.showModal({
            title: '提示',
            content: res.data.message,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack({})
              } else {
                console.log('用户点击取消')
              }
            }
          })
        }
        that.setData({
          data: res.data.data
        })
        able_house_num = res.data.data.roomstatus[0].able_house_num
        roomstatus = res.data.data.roomstatus
        if (res.data.data.red_envelope) {
          keyong=true
          youhuiquan = res.data.data.red_envelope;
          var hongbaotime = res.data.data.red_envelope.use_end_time
          var hongbaoStartTime = res.data.data.red_envelope.use_start_time
          that.setData({
            coupons_id:res.data.data.red_envelope.coupons_id,
            hongbao: res.data.data.red_envelope,
            hongbaoShow:true,
            hongbaoShow1: false,
            hongbaoStartTime: commentjs.dateformat(new Date(hongbaoStartTime * 1000), 'yyyy-MM-dd'),
            hongbaoEndTime: commentjs.dateformat(new Date(hongbaotime * 1000), 'yyyy-MM-dd'),
            buy_limit: res.data.data.red_envelope.buy_limit,
            house_day: res.data.data.red_envelope.house_day,
            desc: res.data.data.red_envelope.desc
          })
          if (res.data.data.red_envelope.type == 0) {
            var num = res.data.data.red_envelope.discount/10
            that.setData({
              num: num,
              detaileType: "折",
              quanname: "打折券"
            })
          } else if (res.data.data.red_envelope.type == 1) {
            var num = res.data.data.red_envelope.money
            that.setData({
              num: num,
              detaileType: "元",
              quanname: "减价"
            })
          } else if (res.data.data.red_envelope.type == 2) {
            var num = res.data.data.red_envelope.money
            that.setData({
              num: num,
              detaileType: "元",
              quanname: "固定价格"
            })
          }
          jisuan = true
          var zongjia = Number(that.data.data.price);
          that.moneyjisuan(zongjia)
        } else {
          if (redEnvelope==1){
            that.setData({
              hongbaoShow: false,
              hongbaoShow1: true
            })
          }else{
            that.setData({
              hongbaoShow: false,
              hongbaoShow1: false
            })
          }
          keyong=false
          that.data.hongbao="";
          that.setData({
            roomstatus: roomstatus
          })
          var amountafter=0;
          for (var i in roomstatus) {
            amountafter += Number(roomstatus[i].price) * that.data.buycount
          }
          youmoney = 0
          that.setData({
            total: amountafter.toFixed(2),
            youmoney: youmoney.toFixed(2),
            amount: amountafter
          })
        }
        
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          });
          return false;
        }
        var data = res.data.data;
        
        var roomstatus = [];
        for (let i = 0; i < data.roomstatus.length; i++) {
          var roomdata = data.roomstatus[i];
          var price = roomdata.price;
          var amount =price;     

          var date = roomdata.day;
          date = commentjs.dateformat(new Date(date * 1000), 'yyyy-MM-dd');
          roomstatus.push({ price: price, date: date });
        }
        that.setData({
          data: data
        })
        that.setData({
          amount: that.data.data.price,
          hotel_id: data.hotel_id,    //酒店id
          room_id:data.id,     //房间id
          room_name: data.name,      //房间名称
          bed_count: data.bed_count,
          people_count: data.people_count,
          has_breakfast: data.has_breakfast,    //早餐
          retentiontime: data.retentiontime,     //保留时间
          square: data.square,       //平米
          bed_size: data.bed_size,
          is_count: data.is_count,
          roomstatus: roomstatus,
          roomstatus_old: data.roomstatus      //房间状态
        }); 
      },
      complete: function (res) {
        // wx.hideLoading();
        // wx.stopPullDownRefresh();
      }
    });
  },

  redpack:function(){     //红包
    wx.navigateTo({
      url: '../coupon/coupon?type=hotel&type_id='+this.data.hotel_id+'&goods_id='+this.data.room_id,
    })
  },

  radiopicc: function (e) {     //picc
    var is_picc = this.data.is_picc;
    if (is_picc) {
      this.setData({
        is_picc: false,
        pic:'00.00'
      });
    } else {
      this.setData({
        is_picc: true,
        pic:'10.00'
      });
    }
    this.moneyjisuan()
  },

  moneyjisuan: function (zongjia) {
    var that = this;
    roomstatus = that.data.data.roomstatus
    if (keyong == true) {
      if (youhuiquan.type == '') {
        amountafter = zongjia
        youmoney = Number('0');
        that.setData({
          total: amountafter.toFixed(2),
          youmoney: youmoney.toFixed(2)
        })
      } else if (youhuiquan.type == '0') {
        // if (that.data.is_picc == false) {     //99*折扣*房间数

        if (that.data.buycount > that.data.buy_limit) {
          if (that.data.day > that.data.house_day) {
            var zhejia = 0;
            var zhezong = 0;
            for (var i in that.data.house_day) {
              zhejia += Number(roomstatus[i].price) * that.data.buy_limit * (youhuiquan.discount / 100) + Number(roomstatus[i].price) * (that.data.buycount - that.data.buy_limit)
              zhezong += Number(roomstatus[i].price) * that.data.buycount
            }
            amountafter = zongjia - (zhezong - zhejia)
            youmoney = zhezong - zhejia
            that.setData({
              total: amountafter.toFixed(2),
              youmoney: youmoney.toFixed(2),
              amount: zongjia
            })
          } else {
            var zhejia = 0;
            var zhezong = 0;
            for (var i in roomstatus) {
              zhejia += Number(roomstatus[i].price) * that.data.buy_limit * (youhuiquan.discount / 100) + Number(roomstatus[i].price) * (that.data.buycount - that.data.buy_limit)
              zhezong += Number(roomstatus[i].price) * that.data.buycount
            }
            amountafter = zongjia - (zhezong - zhejia)
            youmoney = zhezong - zhejia
            that.setData({
              total: amountafter.toFixed(2),
              youmoney: youmoney.toFixed(2),
              amount: zongjia
            })
          }
        } else if (that.data.buy_limit==0){
          if (that.data.day > that.data.house_day) {
            var zhejia = 0;
            var zhezong = 0;
            for (var i in that.data.house_day) {
              zhejia += Number(roomstatus[i].price) * that.data.buycount * (youhuiquan.discount / 100)
              zhezong += Number(roomstatus[i].price) * that.data.buycount
            }
            amountafter = zongjia - (zhezong - zhejia)
            youmoney = zhezong - zhejia
            that.setData({
              total: amountafter.toFixed(2),
              youmoney: youmoney.toFixed(2),
              amount: zongjia
            })
          } else {
            var zhejia = 0;
            var zhezong = 0;
            for (var i in roomstatus) {
              zhejia += Number(roomstatus[i].price) * that.data.buycount * (youhuiquan.discount / 100)
              zhezong += Number(roomstatus[i].price) * that.data.buycount
            }
            amountafter = zongjia - (zhezong - zhejia)
            youmoney = zhezong - zhejia
            that.setData({
              total: amountafter.toFixed(2),
              youmoney: youmoney.toFixed(2),
              amount: zongjia
            })
          }
        } else {
          if (that.data.day > that.data.house_day) {
            var zhejia = 0;
            var zhezong = 0;
            for (var i in that.data.house_day) {
              zhejia += Number(roomstatus[i].price) * that.data.buycount * (youhuiquan.discount / 100)
              zhezong += Number(roomstatus[i].price) * that.data.buycount
            }
            amountafter = zongjia - (zhezong - zhejia)
            youmoney = zhezong - zhejia
            that.setData({
              total: amountafter.toFixed(2),
              youmoney: youmoney.toFixed(2),
              amount: zongjia
            })
          } else {
            var zhejia = 0;
            var zhezong = 0;
            for (var i in roomstatus) {
              zhejia += Number(roomstatus[i].price) * that.data.buycount * (youhuiquan.discount / 100)
              zhezong += Number(roomstatus[i].price) * that.data.buycount
            }
            amountafter = zongjia - (zhezong - zhejia)
            youmoney = zhezong - zhejia
            that.setData({
              total: amountafter.toFixed(2),
              youmoney: youmoney.toFixed(2),
              amount: zongjia
            })
          }

        }
      } else if (youhuiquan.type == '1') {
        for (var i in roomstatus) {
          var a = Number(youhuiquan.money)
          var b = Number(roomstatus[i].price)
            if (that.data.buycount > that.data.buy_limit) {
              if (that.data.day > that.data.house_day) {

                var youmoney = 0
                var aa = Number(youhuiquan.money) * that.data.house_day * that.data.buy_limit;
                var bb = Number(roomstatus[i].price) * that.data.house_day * that.data.buy_limit;
                if (aa > bb) {
                  youmoney = bb
                } else {
                  youmoney = aa
                }

                var amountafter = zongjia - youmoney

                if (amountafter < 0) {
                  amountafter = 0
                }
                if (youmoney < 0) {
                  youmoney = 0
                }
                that.setData({
                  total: amountafter.toFixed(2),
                  youmoney: youmoney.toFixed(2),
                  amount: zongjia
                })
              } else {
                var youmoney = 0
                var aa = Number(youhuiquan.money) * that.data.day * that.data.buy_limit;
                var bb = Number(roomstatus[i].price) * that.data.day * that.data.buy_limit;
                if (aa > bb) {
                  youmoney = bb
                } else {
                  youmoney = aa
                }
                var amountafter = zongjia - youmoney

                if (amountafter < 0) {
                  amountafter = 0
                }
                if (youmoney < 0) {
                  youmoney = 0
                }
                that.setData({
                  total: amountafter.toFixed(2),
                  youmoney: youmoney.toFixed(2),
                  amount: zongjia
                })
              }
            } else if (that.data.buy_limit == 0) {
              if (that.data.day > that.data.house_day) {
                var youmoney = 0
                var aa = Number(youhuiquan.money) * that.data.house_day * that.data.buycount;
                var bb = Number(roomstatus[i].price) * that.data.house_day * that.data.buycount;
                if (aa > bb) {
                  youmoney = bb
                } else {
                  youmoney = aa
                }
                var amountafter = zongjia - youmoney

                if (amountafter < 0) {
                  amountafter = 0
                }
                if (youmoney < 0) {
                  youmoney = 0
                }
                that.setData({
                  total: amountafter.toFixed(2),
                  youmoney: youmoney.toFixed(2),
                  amount: zongjia
                })
              } else {
                var youmoney = 0
                var aa = Number(youhuiquan.money) * that.data.day * that.data.buycount;
                var bb = Number(roomstatus[i].price) * that.data.day * that.data.buycount;
                if (aa > bb) {
                  youmoney = bb
                } else {
                  youmoney = aa
                }

                var amountafter = zongjia - youmoney

                if (amountafter < 0) {
                  amountafter = 0
                }
                if (youmoney < 0) {
                  youmoney = 0
                }
                that.setData({
                  total: amountafter.toFixed(2),
                  youmoney: youmoney.toFixed(2),
                  amount: zongjia
                })
              }
            } else {
              if (that.data.day > that.data.house_day) {
                var youmoney = 0
                var aa = Number(youhuiquan.money) * that.data.house_day * that.data.buycount;
                var bb = Number(roomstatus[i].price) * that.data.house_day * that.data.buycount;
                if (aa > bb) {
                  youmoney = bb
                } else {
                  youmoney = aa
                }
                var amountafter = zongjia - youmoney

                if (amountafter < 0) {
                  amountafter = 0
                }
                if (youmoney < 0) {
                  youmoney = 0
                }
                that.setData({
                  total: amountafter.toFixed(2),
                  youmoney: youmoney.toFixed(2),
                  amount: zongjia
                })
              } else {
                var youmoney = 0
                var aa = Number(youhuiquan.money) * that.data.day * that.data.buycount;
                var bb = Number(roomstatus[i].price) * that.data.day * that.data.buycount;
                if (aa > bb) {
                  youmoney = bb
                } else {
                  youmoney = aa
                }
                var amountafter = zongjia - youmoney
                if (amountafter < 0) {
                  amountafter = 0
                }
                if (youmoney < 0) {
                  youmoney = 0
                }
                that.setData({
                  total: amountafter.toFixed(2),
                  youmoney: youmoney.toFixed(2),
                  amount: zongjia
                })
              }
            }
        }

      } else if (youhuiquan.type == '2') {
        if (Number(that.data.data.price) < Number(youhuiquan.money)) {
          wx.showModal({
            title: '提示',
            content: '房间需支付金额<优惠金额，请重新选择您的券',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else {
                console.log('用户点击取消')
              }

            }
          })
        } else {
          var buycount = Number(that.data.buycount)
          var buy_limit = Number(that.data.buy_limit)
          var day = Number(that.data.day)
          var house_day = Number(that.data.house_day)
          if (buycount > buy_limit) {
            if (day > house_day) {
              var youzong = 0;
              for (var i = 0; i < house_day; i++) {
                youzong += roomstatus[i].price * buy_limit
              }
              var you = Number(youhuiquan.money) * house_day * buy_limit;
              var youmoney = youzong - you
              var amountafter = zongjia - youmoney
              that.setData({
                total: amountafter.toFixed(2),
                youmoney: youmoney.toFixed(2),
                amount: amountafter + youmoney
              })
            } else if (house_day == 0) {
              var youzong = 0;
              for (var i = 0; i < day; i++) {
                youzong += roomstatus[i].price * buy_limit
              }
              var you = Number(youhuiquan.money) * house_day * buy_limit;
              var youmoney = youzong - you
              var amountafter = zongjia - youmoney
              that.setData({
                total: amountafter.toFixed(2),
                youmoney: youmoney.toFixed(2),
                amount: amountafter + youmoney
              })
            } else {
              var youzong=0;
              for (var i = 0; i < day; i++) {
                youzong += roomstatus[i].price * buy_limit
              }
              var you = Number(youhuiquan.money) * day * buy_limit;
              var youmoney = youzong - you
              var amountafter = zongjia - youmoney
              that.setData({
                total: amountafter.toFixed(2),
                youmoney: youmoney.toFixed(2),
                amount: amountafter + youmoney
              })
            }

          } else if (buy_limit == 0) {
            if (day > house_day) {
              var youzong = 0;
              for (var i = 0; i < house_day; i++) {
                youzong += roomstatus[i].price * buy_limit
              }
              var you = Number(youhuiquan.money) * house_day * buy_limit;
              var youmoney = youzong - you
              var amountafter = zongjia - youmoney
              that.setData({
                total: amountafter.toFixed(2),
                youmoney: youmoney.toFixed(2),
                amount: amountafter + youmoney
              })
            } else if (house_day == 0) {
              var youzong = 0;
              for (var i = 0; i < day; i++) {
                youzong += roomstatus[i].price * buy_limit
              }
              var you = Number(youhuiquan.money) * house_day * buy_limit;
              var amountafter = zongjia - youzong + you
              var youmoney = zongjia - amountafter
              that.setData({
                total: amountafter.toFixed(2),
                youmoney: youmoney.toFixed(2),
                amount: amountafter + youmoney
              })
            } else {
              var youzong = 0;
              for (var i = 0; i < day; i++) {
                youzong += roomstatus[i].price * buy_limit
              }
              var you = Number(youhuiquan.money) * house_day * buy_limit;
              var amountafter = zongjia - youzong + you
              var youmoney = zongjia - amountafter
              that.setData({
                total: amountafter.toFixed(2),
                youmoney: youmoney.toFixed(2),
                amount: amountafter + youmoney
              })
            }
          } else {
            if (day > house_day) {
              var youzong = 0;
              for (var i = 0; i < house_day; i++ ) {
                youzong += roomstatus[i].price * buycount
              }
              var you = Number(youhuiquan.money) * house_day * buycount;

              var youmoney = youzong - you
              var amountafter = zongjia - youmoney
              that.setData({
                total: amountafter.toFixed(2),
                youmoney: youmoney.toFixed(2),
                amount: amountafter + youmoney
              })
            } else if (house_day==0){
              var youzong = 0;
              for (var i = 0; i < day; i++) {
                youzong += roomstatus[i].price * buycount
              }
              var you = Number(youhuiquan.money) * house_day * buy_limit;
              var youmoney = youzong - you
              var amountafter = zongjia - youmoney
              that.setData({
                total: amountafter.toFixed(2),
                youmoney: youmoney.toFixed(2),
                amount: amountafter + youmoney
              })
            }else {
              var youzong = 0;
              for (var i=0;i<day;i++) {
                youzong += roomstatus[i].price * buycount
              }
              var you = Number(youhuiquan.money) * day * buycount;
              var youmoney = zongjia - you
              that.setData({
                total: you.toFixed(2),
                youmoney: youmoney.toFixed(2),
                amount: you + youmoney
              })
            }
          }
        }
      }
    } else {
      var roomstatus = that.data.roomstatus;
      if (jisuan == true) {
        var amountafter = 0;
        for (var i in roomstatus) {
          amountafter += Number(roomstatus[i].price) * that.data.buycount
        }
        youmoney = 0
        that.setData({
          total: amountafter.toFixed(2),
          youmoney: youmoney.toFixed(2),
          amount: amountafter
        })
      } else {
        var amountafter = 0;
        for (var i in roomstatus) {
          amountafter += Number(roomstatus[i].price) * that.data.buycount
        }
        youmoney = 0
        that.setData({
          total: amountafter.toFixed(2),
          youmoney: youmoney.toFixed(2),
          amount: amountafter
        })
      }
    }
      
  },
  bindOrder:function(){      //去支付
    if(!this.data.is_xuanze){
      this.showToast('请先同意酒店预订协议');
      return false;
    }
    if (!this.data.people_list.tel) {
      this.showToast('请填写接收通知的手机号');
      return false;
    }
    if (!this.data.people_list.truename) {
      this.showToast('请填写入住人的姓名');
      return false;
    } else if (this.data.people_list.tel) {
      if (!commentjs.is_phone(this.data.people_list.tel)) {
        this.showToast('手机号格式不正确');
        return false;
      } else if (this.data.people_list.truename) {
        var str = this.data.people_list.truename
        var reg = /^([\u4e00-\u9fa5]){2,7}$/;
        if (!reg.test(str)) {
          this.showToast('姓名格式不正确');
          return false;
        }
      }
    } 
    var coupons_id = this.data.coupons_id
    var that = this;
    var uat = wx.getStorageSync('uat');
    var amount = Number(this.data.total) + Number(this.data.youmoney);
    if (coupons_id == undefined){
      coupons_id=""
    }
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat = wx.getStorageSync('uat');
      var data = {
        access_token: uat,
        amount: amount,
        count: that.data.buycount,
        day_count: that.data.day,
        from_date: that.data.start_date,
        get_name: that.data.people_list.truename,
        hotel_id: that.data.hotel_id,
        room_type_id: that.data.room_id,
        end_date: that.data.end_date,
        platform: '分享小程序',
        red_package_id: coupons_id,
        pic: that.data.pic,
        get_tel: that.data.people_list.tel,
        idcard: "",
        detail: [],
        total_price: that.data.total
      };
      wx.request({
        url: app.globalData.publicjs.hotelserver4_api_url + 'order/save',
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: data,
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            });
            return false;
          }
          var data = res.data.data;
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          });
          if (res.data.data.amount == "0.00") {
            wx.redirectTo({
              url: '../paysuccess/paysuccess?order_id=' + res.data.data.id,
            })
          } else {
            wx.navigateTo({
              url: '../hotelpay/hotelpay?order_id=' + data.id + '&type=hotel',
            })
          }
        }
      });
    })

  },

  showToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'none'
    });
  },

  bindXuanze:function(e){   //同意酒店协议
    var is_xuanze=this.data.is_xuanze;
    if (is_xuanze){
      this.setData({
        is_xuanze:false
      });
    } else {
      this.setData({
        is_xuanze: true
      });
    }
  },

  hotelagree:function(){     //跳转酒店协议
    var cat = wx.getStorageSync('cat');
    wx.navigateTo({
      url: '../../../agreement/agreement?access_token='+cat+'&tag=hotelagreement',
    })
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
  //减
  bindMinus: function (e) {
    var that=this;
    var buycount = this.data.buycount;
    var is_count = this.data.is_count;
    var people_list = this.data.people_list;
    if (buycount > 1) {
      buycount--;
      // 将数值与状态写回
      this.setData({
        buycount: buycount,
        people_list: people_list
      });
      jisuan=false
      var roomstatus = that.data.data.roomstatus;
      var zongjia=0;
      for (var i in roomstatus){
        zongjia += roomstatus[i].price * buycount
      }
      this.moneyjisuan(zongjia)
    } else {
      wx: wx.showToast({
        title: '最少选1间',
        image: '/img/warn_icon.png',
      })
    }
  },
  //加
  bindPlus: function (e) {
    var that = this;
    var buycount=this.data.buycount;
    var is_count =able_house_num;
    var people_list = this.data.people_list;
    if (buycount < is_count){
      buycount++;
      // 将数值与状态写回
      this.setData({
        buycount: buycount,
        people_list: people_list
      });
      jisuan =true
      var zongjia = 0;
      var roomstatus = that.data.data.roomstatus;
      for (var i in roomstatus) {
        zongjia += roomstatus[i].price * buycount
      }
      this.moneyjisuan(zongjia)
    }else{
      wx:wx.showToast({
        title: '最多选' + is_count+'间',
        image: '/img/warn_icon.png',
      })
    }
  }
 
})