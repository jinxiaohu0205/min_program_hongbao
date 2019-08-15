// new/search/search_index/search_index.js
var app = getApp();
const innerAudioContext = wx.createInnerAudioContext();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js'); 
var commentjs = require('../../../commentJs/comment.js');
var Moment = require("../../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();
var qqmapsdk = new QQMapWX({
  key: '54QBZ-LLVWW-CCHRI-RTQXG-WG2EV-SOFAK' // 必填
});
Page({
  data: {
    inputShowed: false,
    contentShowed: false,
    inputVal: "",
    roomstatus: [],
    latitude: '',
    longitude: '',
    id: '',            
    start_date: '',
    end_date: '',
    startdate: '',
    enddate: '',
    startdate1: '',
    enddate1: '',
    startdate2: '',
    enddate2: '',
    day:'',
    red_envelope_id: '',
    isred: 0,
    isimgs: false,
    end_date: '',
    page: 1,
    total:'',
    hong_img:"",
    tabs: [
      { title: "酒店" },
      { title: "门票" }
    ],
    currentTab: 0,
    jiudianTab:[
      { title: "不限" },
      { title: "经济" },
      { title: "主题" },
      { title: "舒适" },
      { title: "高档" },
      { title: "豪华" }
    ],
    jiudianListTab:0,
    showTab:true,
    showListTab: true,
    rating:"",
    soubtn:false,
    weizhi: "五台山",
    rating_checkbox: [
      { name: '0', value: '不限', checked: true },
      { name: '1', value: '经济型' },
      { name: '3', value: '三星/舒适' },
      { name: '4', value: '四星/高档' },
      { name: '5', value: '五星/豪华' },
      { name: '7', value: '主题型' }
    ],
    checkArr: "筛选星级",
    xuanshow:false,
    listshow:false,
    xuanweek2:"",
    xuanweek1:"",
    checkShowArr:[],
    rating: "",
    sordName: ['推荐排序', '星级排序', '高价优先', '好评优先', '附近酒店'],
    latitude:"",
    longitude: "",
    animationData: {},
    sord_index: 0,
    checkInDate: "",
    checkOutDate: "",
    opacity: 1,
    leftValue: 0, //左边滑块默认值
    rightValue: 1000, //右边滑块默认值
    animationData:false

  },
  // 左边滑块滑动的值
  leftChange: function (e) {
    var that = this;
    that.setData({
      leftValue: e.detail.value //设置左边当前值
    })
  },
  // 右边滑块滑动的值
  rightChange: function (e) {
    var that = this;
    that.setData({
      rightValue: e.detail.value,
    })
  },
  onReady: function () {
    this.animation = wx.createAnimation()
  },
  onLoad: function (options) {
    wx.setStorage({
      key: 'ROOM_SOURCE_DATE',
      data: {
        checkInDate: Moment(new Date()).format('YYYY-MM-DD'),
        checkOutDate: Moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
      }
    });
    var that=this;
    wx.getLocation({
      type: 'wgs84',// 默认wgs84
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        var location = that.data.latitude + "," + that.data.longitude
        qqmapsdk.reverseGeocoder({
          location: location,
          success: function (res) {//成功后的回调
            var res = res.result;
            that.setData({
              weizhi: res.formatted_addresses.recommend
            })
          }
        })

      }
    })
    
    

    wx.getSetting({
      success(res) {
        if (JSON.stringify(res.authSetting) == "{}") {
          wx.navigateTo({
            url: '../../author/author'
          })
        }
      }
    })
    var cat = wx.getStorageSync('cat');
    var that = this;
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
    var latitude;
    var longitude;
    if (options.latitude){
      latitude=options.latitude
    }else{
      latitude=""
    }
    if (options.longitude) {
      longitude = options.longitude
    }else{
      longitude=""
    }

    var week1 = new Date(start_date).getDay();
    var week2 = new Date(end_date).getDay();
    var xuanweek1=""
    var xuanweek2=""
    if (week1 == 0) {
      xuanweek1 = "星期日"
    } else if (week1 == 1) {
      xuanweek1 = "星期一"
    } else if (week1 == 2) {
      xuanweek1 = "星期二"
    } else if (week1 == 3) {
      xuanweek1 = "星期三"
    } else if (week1 == 4) {
      xuanweek1 = "星期四"
    } else if (week1 == 5) {
      xuanweek1 = "星期五"
    } else if (week1 == 6) {
      xuanweek1 = "星期六"
    }
    if (week2 == 0) {
      xuanweek2 = "星期日"
    } else if (week2 == 1) {
      xuanweek2 = "星期一"
    } else if (week2 == 2) {
      xuanweek2 = "星期二"
    } else if (week2 == 3) {
      xuanweek2 = "星期三"
    } else if (week2 == 4) {
      xuanweek2 = "星期四"
    } else if (week2 == 5) {
      xuanweek2 = "星期五"
    } else if (week2 == 6) {
      xuanweek2 = "星期六"
    }
    console.log(start_date)
    console.log(start_date.split("-"))
    console.log(start_date.split("-")[1])
    console.log(start_date.split("-")[2])
    var startdate1 = start_date.split("-")[1] + "月" + start_date.split("-")[2] + "日"
    console.log(startdate1)
    var enddate1 = end_date.split("-")[1] + "月" + end_date.split("-")[2] + "日"
    console.log(enddate1)
    that.setData({
      latitude:latitude,
      longitude:longitude,
      start_date: start_date,
      end_date: end_date,
      startdate: start_date,
      enddate: end_date,
      xuanweek2: xuanweek2,
      xuanweek1: xuanweek1,
      startdate1: startdate1,
      enddate1: enddate1,
      startdate2: start_date.substring(5),
      enddate2: end_date.substring(5),
      day:"1"
    });
  },
  toGetLocation:function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',// 默认wgs84
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        var location = that.data.latitude + "," + that.data.longitude
        qqmapsdk.reverseGeocoder({
          location: location, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
          //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
          success: function (res) {//成功后的回调
            var res = res.result;
            that.setData({
              weizhi: res.formatted_addresses.recommend
            })
          }
        })

      }
    })
  },
  onShow:function(){
    let getDate = wx.getStorageSync("ROOM_SOURCE_DATE");
    var days = new Date(getDate.checkOutDate).getTime() - new Date(getDate.checkInDate).getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    var week1 = new Date(getDate.checkInDate).getDay()
    var week2 = new Date(getDate.checkOutDate).getDay()
    var xuanweek2 = ''
    var xuanweek1 = ''
    if (week1 == 0) {
      xuanweek1 = "星期日"
    } else if (week1 == 1) {
      xuanweek1 = "星期一"
    } else if (week1 == 2) {
      xuanweek1 = "星期二"
    } else if (week1 == 3) {
      xuanweek1 = "星期三"
    } else if (week1 == 4) {
      xuanweek1 = "星期四"
    } else if (week1 == 5) {
      xuanweek1 = "星期五"
    } else if (week1 == 6) {
      xuanweek1 = "星期六"
    }
    if (week2 == 0) {
      xuanweek2 = "星期日"
    } else if (week2 == 1) {
      xuanweek2 = "星期一"
    } else if (week2 == 2) {
      xuanweek2 = "星期二"
    } else if (week2 == 3) {
      xuanweek2 = "星期三"
    } else if (week2 == 4) {
      xuanweek2 = "星期四"
    } else if (week2 == 5) {
      xuanweek2 = "星期五"
    } else if (week2 == 6) {
      xuanweek2 = "星期六"
    }

    var startdate1 = getDate.checkInDate.split("-")[1] + "月" + getDate.checkInDate.split("-")[2] + "日"
    var enddate1 = getDate.checkOutDate.split("-")[1] + "月" + getDate.checkOutDate.split("-")[2] + "日"
    this.setData({
      checkInDate: getDate.checkInDate,
      checkOutDate: getDate.checkOutDate,
      startdate: getDate.checkInDate,
      enddate: getDate.checkOutDate,
      startdate1: startdate1,
      enddate1: enddate1,
      startdate2: getDate.checkInDate.substring(5),
      enddate2: getDate.checkOutDate.substring(5),
      xuanweek1: xuanweek1,
      xuanweek2: xuanweek2,
      day: day
    })
    //验证cat过期没有
    var that=this;
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      if (that.data.currentTab == 0) {
        that.setData({
          roomstatus: [],
          page:1,
          listshow:false
        })
        that.sousuo();
        that.setData({
          showListTab: true
        })
      } else if (that.data.currentTab == 1) {
        that.setData({
          roomstatus: []
        })
        that.piaosou();
        that.setData({
          showListTab: false
        })
      }
    })
  },

  dianji: function () {
    wx.navigateTo({
      url: '../calendar/index'
    })
  },
  bindPickerChange: function (e) {
    var animation = wx.createAnimation({
      duration: 200,
    });
    this.animation = animation;
    var Rating_box = this.data.Rating_box;
    if (Rating_box) {
      Rating_box = false;
      animation.left('-1000rpx').step();
    }
    this.setData({
      animationData: animation.export(),
      Rating_box: Rating_box,
      roomstatus: [],
      page: 1,
      sord_index: e.detail.value
    });
    this.sousuo();
  }, 
  //星级选择
  /**
   * 星级筛选数据修改
   */
  checkboxChange: function (e) {
    var checked = e.detail.value;
    var changed = {};
    for (var i = 0; i < this.data.rating_checkbox.length; i++) {
      var checked_name = checked.indexOf(this.data.rating_checkbox[i].name);

      if (checked_name !== -1) {
        changed['rating_checkbox[' + i + '].checked'] = true;
      } else {
        changed['rating_checkbox[' + i + '].checked'] = false;
      }
    }
    this.setData(changed);
  },
  /**
   * 星级筛选是否选择不限
   */
  bindCheckbox: function (e) {
    var name = e.currentTarget.dataset.id;
    var changed = {};
    for (var i = 0; i < this.data.rating_checkbox.length; i++) {
      var checked_name = this.data.rating_checkbox[i].name;
      if (name == 0) {
        if (checked_name == 0) {
          changed['rating_checkbox[' + i + '].checked'] = true;
        } else {
          changed['rating_checkbox[' + i + '].checked'] = false;
        }
      } else {
        if (checked_name == 0) {
          changed['rating_checkbox[' + i + '].checked'] = false;
        }
      }
    }
    this.setData(changed);
  },
  /**
   * 星级筛选弹出收起动画效果
   */
  bindRating: function (e) {
    var animationData = !this.data.animationData;
    this.setData({
      animationData: animationData
    })
  },
  /**
   * 星级筛选清空按钮
   */
  bindratingClear: function (e) {
    var changed = {};
    for (var i = 0; i < this.data.rating_checkbox.length; i++) {
      var checked_name = this.data.rating_checkbox[i].name;
      if (checked_name == 0) {
        changed['rating_checkbox[' + i + '].checked'] = true;
      } else {
        changed['rating_checkbox[' + i + '].checked'] = false;
      }
    }
    this.setData(changed);
    var rating="";
    this.setData({
      rating: rating,
      roomstatus: [],
      leftValue:0,
      rightValue:1000
    })
    this.sousuo()
  },
  /**
   * 星级筛选确认按钮
   */
  bindRatingBtn: function () {
    
    var rating = '';
    var rating_checkbox = this.data.rating_checkbox;
    for (let i = 0; i < rating_checkbox.length; i++) {
      if (rating_checkbox[i].checked) {
        rating += rating_checkbox[i].name;
        rating += ',';
      }
    }
    rating = rating.slice(0, rating.length - 1);
    var arr=[]
    for (var i in rating_checkbox) {
      var checked_name = rating.indexOf(rating_checkbox[i].name);
      if (checked_name !== -1) {
        arr.push(rating_checkbox[i].value)
      }
    }
    var animation = wx.createAnimation({
      duration: 200,
    });
    animation.left('-1000rpx').step();
    this.setData({
      rating: rating,
      roomstatus: [],
      xuanshow: false,
      animationData: animation,
      Rating_box : false,
      checkArr: arr,
      opacity:1
    })
    
    this.sousuo()
  },
  showxuan: function () {//显示星级选择
    this.setData({
      xuanshow: true,
      opacity:0.5
    })
  },
  queding: function () {//确定
    var rating = this.data.checkShowArr.join(',')
    this.setData({
      xuanshow: false,
      rating: rating,
      opacity: 1
    })
  },
  inputTyping: function (e) {//输入框搜索
    this.setData({
      contentShowed: false,
      roomstatus: []
    });
    if (typeof (e) === 'object') {
      this.setData({
        inputVal: e.detail.value,
        page: 1
      })
    } else {
      if (this.data.page > 1) {
        this.setData({
          inputVal: e
        });
      } else {
        this.setData({
          inputVal: e.detail.value
        });
      }
    }
    this.sousuo()
  },
  inputTyping1: function (e) {//点击搜索
    this.setData({
      listshow: true,
      showListTab:false,
      roomstatus: []
    })
    this.sousuo()
  },
  //点击切换
  bindTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.index) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.index
      })
    }
    if (this.data.currentTab == 0) {
      that.setData({
        showListTab: true,
        roomstatus: [],
        total: 0,
        page:1
      })
      this.sousuo()
    } else if (this.data.currentTab == 1) {
      that.setData({
        showListTab: false,
        roomstatus: [],
        total: 0,
        listshow: false
      })
      this.piaosou()
    }
  },
  onReachBottom: function () {
    var that=this;
    if (this.data.currentTab == 0) {
      var page = that.data.page+1
      that.setData({
        page: page
      })
      that.sousuo()
    }
  },
  sousuo: function () {
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
        url: app.globalData.publicjs.hotelserver_api_url + 'hotel1/hotelsearch',
        method: 'get',
        data: {
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          access_token: uat,
          hotelname: that.data.inputVal,
          rating: that.data.rating,
          sord: that.data.sord_index,
          minprice: that.data.leftValue,
          maxprice: that.data.rightValue,
          page: that.data.page
        },
        success: function (res) {
          var data = res.data.data.data;
          that.setData({
            soubtn: false
          });
          var roomstatus = that.data.roomstatus;
          var total = res.data.data.total
          var length = data.length;
          if (res.data.data.last_page - res.data.data.current_page == 0) {
            if (length != 0) {
              for (var i in data) {
                var roomdata = data[i];
                var room_data = {};
                room_data.price = roomdata.minprice;
                room_data.id = roomdata.id;
                room_data.address = roomdata.address;
                room_data.device = roomdata.device;
                room_data.image = roomdata.image;
                room_data.name = roomdata.name;
                room_data.rating = roomdata.rating;
                room_data.id = roomdata.id;
                room_data.redenvelope = roomdata.red_envelope;
                room_data.isred = roomdata.is_red;
                roomstatus.push(room_data);
              }
            }else{
              wx.showToast({
                title: '已加载完毕',
                icon: 'succes',
                duration: 1000,
                mask: true
              })
            }
          } else {
            for (var i in data) {
              var roomdata = data[i];
              var room_data = {};
              room_data.price = roomdata.minprice;
              room_data.id = roomdata.id;
              room_data.address = roomdata.address;
              room_data.device = roomdata.device;
              room_data.image = roomdata.image;
              room_data.name = roomdata.name;
              room_data.rating = roomdata.rating;
              room_data.id = roomdata.id;
              room_data.redenvelope = roomdata.red_envelope;
              room_data.isred = roomdata.is_red;
              roomstatus.push(room_data);
            }
          }
          that.setData({
            roomstatus: roomstatus,
            total: total
          });
        }
      })
    })
  },
  piaosou:function(){
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
        url: app.globalData.publicjs.hotelserver_api_url + 'Hotel1/ticket_search',
        method: 'get',
        data: {
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          access_token: uat
        },
        success: function (res) {
          var data = res.data.data;
          var roomstatus = that.data.roomstatus;
          var length = data.length;
          for (var i in data) {
            var roomdata = res.data.data[i];
            var room_data = {};
            room_data.price = roomdata.minprice;
            room_data.id = roomdata.id;
            room_data.address = roomdata.address;
            room_data.devicea = roomdata.intro;
            room_data.image = roomdata.image;
            room_data.name = roomdata.name;
            room_data.rating = roomdata.rating;
            room_data.id = roomdata.id;
            room_data.redenvelope = roomdata.red_envelope;
            room_data.isred = roomdata.is_red;
            roomstatus.push(room_data);
          }
          that.setData({
            roomstatus: roomstatus,
            length: length,
            total: length
          });
        }
      })
    })
   
    
  },
  bindTabjiudian: function (e) {
    var that = this;
    if (this.data.jiudianListTab === e.currentTarget.dataset.index) {
      return false;
    } else {
      that.setData({
        jiudianListTab: e.currentTarget.dataset.index
      })
    }
    var num = this.data.jiudianListTab;
    if(num==0){
      that.setData({
        rating: ""
      })
    } else if (num == 1) {
      that.setData({
        rating: 1
      })
    } else if (num == 2) {
      that.setData({
        rating: 7
      })
    } else if (num == 3) {
      that.setData({
        rating: 3
      })
    } else if (num == 4) {
      that.setData({
        rating: 8
      })
    } else if (num == 5) {
      that.setData({
        rating: 5
      })
    } else{
      that.setData({
        rating: 1
      })
    }
    that.setData({
      page: 1,
      roomstatus:[]
    })
    this.sousuo()
  },
  showInput: function () {
    this.setData({
      inputShowed: true,
      inputVal:""
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      page:1,
      inputShowed: false,
      contentShowed: true,
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      page: 1,
    });
  },
  getred: function (e) {
    var eid = e.currentTarget.dataset.index.redenvelope;
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
        url: app.globalData.publicjs.server_Redenvelope_url + 'Redenvelope/detail',
        method: "GET",
        data: { access_token: uat, red_envelope_id: eid },
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            });
            return false;
          }
          var data = res.data.data;
          var hongbaoNum = data.createnum - data.num
          if (data.hongbaoNum <= 0) {
            that.setData({
              hong_img: data.image,
              hong_module: data.module,
              hong_name: data.name,
              hong_num: hongbaoNum,
              red_envelope_id: data.id,
              ishidden: true,
              isimgs: false
            })

            that.animation.scale(0).step({ duration: 200 })
            that.setData({ animation: that.animation.export() })
          } else {
            that.setData({
              hong_img: data.image,
              hong_module: data.module,
              hong_name: data.name,
              hong_num: hongbaoNum,
              red_envelope_id: data.id,
              ishidden: true,
              isimgs: true
            })
            that.animation.scale(1).step({ duration: 200 })
            that.setData({ animation: that.animation.export() })
          }
        }
      })
    })
  },
  close: function (e) {
    this.setData({
      isimgs: false,
      xuanshow: false,
      opacity: 1
    });

    this.animation.scale(0).step({ duration: 200 })
    this.setData({ animation: this.animation.export() })
  },
  navget: function (e) {
    var that=this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
      var uat = wx.getStorageSync('uat');
      var cat = wx.getStorageSync('cat');
      wx.request({
        url: app.globalData.publicjs.server_Redenvelope_url + 'Redenvelope/red_envelope_enable',
        method: "GET",
        data: {
          access_token: uat,
          red_envelope_id: that.data.red_envelope_id
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            });
          } else {
            innerAudioContext.src = 'http://datacenter.sxzhwts.com/uploads/video/sheng.mp3';
            innerAudioContext.play();
            innerAudioContext.onPlay(() => {
              //console.log("开始播放")
            })
            wx.navigateTo({
              url: '../hbd/hbd?access_token=' + cat + '&red_envelope_id=' + that.data.red_envelope_id
            })
          }
        }
      })
    })
   
    
    this.setData({
      isimgs: false
    })

    this.animation.scale(0).step({ duration: 200 })
    this.setData({ animation: this.animation.export() })
  },
  goyu: function (e) {
    if (this.data.currentTab==0){
      wx.navigateTo({
        url: '../hotel/hotel_details/hotel_details?&hotel_id=' + e.currentTarget.dataset.item.id + '&starttime=' + this.data.start_date + '&endtime=' + this.data.end_date,
      })
    } else if (this.data.currentTab==1){
      wx.navigateTo({
        url: '../scenic/scenic_details/scenic_details?&scenic_id=' + e.currentTarget.dataset.item.id + '&starttime=' + this.data.start_date + '&endtime=' + this.data.end_date,
      })
    }
  },
  onShareAppMessage: function () {//转发
    return {
      title: "五台山综合性旅游服务平台",
      imageUrl: "../img/wutai.png"
    }
  }
});