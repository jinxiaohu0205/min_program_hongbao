var commentjs = require('../../../commentJs/comment.js');
const innerAudioContext = wx.createInnerAudioContext();

const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var sliderWidth = 90;
var tabType=""
var aa=true
Page({
  data: {
    tabs:[{
      name: "全部",
      img: "../img/all.png",
      img2: "../img/all2.png"
    },{
        name: "酒店",
        img: "../img/hotel.png",
        img2: "../img/hotel2.png"
      },{
        name: "门票",
        img: "../img/piao.png",
        img2: "../img/piao2.png"
      }],
    ishidden:false,
    hong_img: '',
    hong_module: '',
    hong_name: '',
    hong_num: '',
    bless:"",
    red_envelope_id: '',
    isimgs:false,
    cat :'',
    uat:'',
    map: {
      markers: [],
      longitude: 113.597540,
      latitude: 39.007700,
      scale: 15,
      hasMarkers: false
    },  
    rating_checkbox: [
      { name: '0', value: '不限', checked: true },
      { name: '1', value: '经济' },
      { name: '3', value: '三星' },
      { name: '4', value: '四星' },
      { name: '5', value: '五星' },
      { name: '7', value: '主题' },
    ],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    activeIndexs: 0,
    sliderOffsets: 0,
    sliderLefts: 0,
    bb:false,
    valredpack:'',
    controls: [{
      id: 1,
      iconPath: '../img/dingwei4.png',
      position: {
        left: 0,
        top: 0,
        width: 20,
        height: 33
      },
      clickable: true
    }],
    isplay: false
  },

  onLoad: function (options) { 
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    that.setData({
      cat: wx.getStorageSync('cat'),
      uat: wx.getStorageSync('uat'),
      activeIndex:0
    })
    wx.getSetting({
      success(res) {
        if (JSON.stringify(res.authSetting) == "{}") {
          wx.navigateTo({
            url: '../../author/author'
          })
        } else {
          if (that.data.bb==true){
            that.setData({
              'map.latitude': 39.007700,
              'map.longitude': 113.597540
            })
          }else{
            wx.getLocation({
              type: "gcj02", // 坐标系类型
              success: (res) => {
                var distance = commentjs.GetDistance(res.latitude, res.longitude, 39.007700, 113.597540);
                var num = 10;
                if (distance > num) {
                  res.latitude = 39.007700,
                  res.longitude = 113.597540,
                  that.setData({
                    'map.latitude': res.latitude,
                    'map.longitude': res.longitude
                  })
                }
              }
            })
          }
          
        }
      }
    }) 
    if (!this.data.map.longitude || !this.data.map.latitude || !cat){
      var cat = wx.getStorageSync('cat');
      var lon = 113.597540;
      var lat = 39.007700;
      var rat = "";
      var type = '';
      this.getViewData(lon, lat, rat, type);
    } else {
      var lon = this.data.map.longitude;
      var lat = this.data.map.latitude;
      var rat = "";
      var type = '';
      this.getViewData(lon, lat, rat, type);
    }
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: '../img/dingwei4.png',
            position: {
              left: res.windowWidth / 2 - 11,
              top: res.windowHeight / 2 - 45,
              width: 20,
              height: 33
            },
            clickable: true
          }]
        })
      }
    });
  },
  onReady: function () {
    this.animation = wx.createAnimation()
    this.animation.scale(0).step()
    this.setData({ animation: this.animation.export() })
  },
  onShow: function () {
    this.mapCtx = wx.createMapContext("myMap");
   this.onLoad()
  },
  getViewData: function (lon, lat, rat, type){
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
        url: app.globalData.publicjs.server_Redenvelope_url + 'Redenvelope/index',
        method: "GET",
        data: {
          access_token: uat,
          longitude: lon,
          latitude: lat,
          rating: rat,
          type: type
        },
        success: function (res) {
          let data = res.data.data
          let markers_new = [];
          if (data.length == 0) {
            markers_new.push({
              id: "",
              latitude: 0,
              longitude: 0,
              name: "",
              iconPath: "",
              width: 0,
              height: 0,
              callout: {
                content: "",
                fontSize: 0,
                color: '',
                bgColor: '',
                padding: 8,
                borderRadius: 10,
                borderRadius: 4,
                boxShadow: '2px 4px 8px 0 rgba(0)',
                //display: 'ALWAYS'
              }
            })
            that.setData({
              'map.markers': markers_new,
              'map.hasMarkers': true
            })
          } else {
            for (let i = 0; i < data.length; i++) {
              var d = data[i];
              markers_new.push({
                id: d.id,
                latitude: d.latitude,
                longitude: d.longitude,
                name: d.name,
                iconPath: "../img/hong.png",
                width: 55,
                height: 62,
                callout: {
                  content: d.name + '的优惠券',
                  fontSize: 12,
                  color: '#222',
                  bgColor: '#fff',
                  padding: 5,
                  borderRadius: 10,
                  borderRadius: 4,
                  boxShadow: '2px 4px 8px 0 rgba(0)',
                  //display:'ALWAYS'
                }
              })
              that.setData({
                'map.markers': markers_new,
                'map.hasMarkers': true
              })
            }

          }
        }, complete: function (res) {
          wx.hideLoading();
        }
      })
    })

  },
  // 地图视野改变事件
  bindregionchange: function (e) {   // 拖动地图，获取红包位置
    var uat = wx.getStorageSync('uat');
    var that = this;
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      var that = this;
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function (mapres) {
          //验证cat过期没有
          app.getToken().then(function (res) {
            //这里说明就存上了cat
          })
          //验证uat过期没有
          app.getTokenUat().then(function (res) {
            //这里说明就存上了uat
            var uat = wx.getStorageSync('uat');
            wx.request({
              url: app.globalData.publicjs.server_Redenvelope_url + 'Redenvelope/index',
              method: "GET",
              data: {
                access_token: uat,
                longitude: mapres.longitude,
                latitude: mapres.latitude,
                type: tabType
              },
              success: function (res) {
                let data = res.data.data
                let markers_new = [];
                if (data.length == 0) {
                  markers_new.push({
                    id: "",
                    latitude: 0,
                    longitude: 0,
                    name: "",
                    iconPath: "",
                    width: 0,
                    height: 0,
                    callout: {
                      content: "",
                      fontSize: 0,
                      color: '',
                      bgColor: '',
                      padding: 8,
                      borderRadius: 10,
                      borderRadius: 4,
                      boxShadow: '2px 4px 8px 0 rgba(0)',
                      //display: 'ALWAYS'
                    }
                  })
                  that.setData({
                    'map.markers': markers_new,
                    'map.hasMarkers': true
                  })
                } else {
                  for (let i = 0; i < data.length; i++) {
                    var d = data[i];
                    markers_new.push({
                      id: d.id,
                      latitude: d.latitude,
                      longitude: d.longitude,
                      name: d.name,
                      iconPath: "../img/hong.png",
                      width: 55,
                      height: 62,
                      callout: {
                        content: d.name + '的优惠券',
                        fontSize: 12,
                        color: '#222',
                        bgColor: '#fff',
                        padding: 5,
                        borderRadius: 10,
                        borderRadius: 4,
                        boxShadow: '2px 4px 8px 0 rgba(0)',
                        //display: 'ALWAYS'
                      }
                    })
                    that.setData({
                      'map.markers': markers_new,
                      'map.hasMarkers': true
                    })
                  }
                }
              },
              complete: function () {
                wx.hideLoading();
                wx.stopPullDownRefresh();
              }
            });
          })
          
        }
      })
    }
    
   
  },
  // 地图标记点击事件，连接用户位置和点击的单车位置
  bindmarkertap: function (e) {
    var that = this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
      var uat = wx.getStorageSync('uat');
      var cat = wx.getStorageSync('cat');
      wx.request({
        url: app.globalData.publicjs.server_Redenvelope_url + 'Redenvelope/detail',
        method: "GET",
        data: { access_token: cat, red_envelope_id: e.markerId },
        success: function (res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            });
            return false;
          }
          var data = res.data.data;
          that.setData({
            hong_img: data.image,
            hong_module: data.module,
            hong_name: data.name,
            bless: data.bless,
            hong_num: data.createnum - data.num,
            red_envelope_id: data.id,
            ishidden: true,
            isimgs: true,
            isplay: true
          })
          that.animation.scale(1).step({ duration: 200 })
          that.setData({ animation: that.animation.export() })
        }
      })
    })
    //验证uat过期没有
    app.getTokenUat().then(function (res) {
      //这里说明就存上了uat
    })
    
  },
  tabClick: function (e) {
    aa=false
    if (this.data.isimgs==true){
      this.setData({
        isimgs: false
      });

      this.animation.scale(0).step({ duration: 200 })
      this.setData({ animation: this.animation.export() })
    }
    if (e.currentTarget.id == 0){
      var lon = this.data.map.longitude;
      var lat = this.data.map.latitude;
      var rat = "";
      var type = '';
      tabType=""
      this.getViewData(lon, lat, rat, type);
    }        
    if (e.currentTarget.id == 1) {
      var lon = this.data.map.longitude;
      var lat = this.data.map.latitude;
      var rat = "";
      var type = 'hotel';
      tabType="hotel"
      this.getViewData(lon, lat, rat, type);
    }
    if (e.currentTarget.id == 2) {
      var lon = this.data.map.longitude;
      var lat = this.data.map.latitude;
      var rat = "";
      var type = 'scenic';
      tabType ="scenic"
      this.getViewData(lon, lat, rat, type);
    }
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
      
    });
  },
  close:function(e){
    this.setData({
      isimgs: false
    });
    this.animation.scale(0).step({ duration: 200 })
    this.setData({ animation: this.animation.export() })
  },
  navget:function(e){
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
            innerAudioContext.src = 'https://datacenter.sxzhwts.com/uploads/video/sheng.mp3';
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
      isimgs:false
    })

    this.animation.scale(0).step({ duration: 200 })
    this.setData({ animation: this.animation.export() })
  },

  searchtap:function(){
    wx.navigateTo({
      url: '../search/search?latitude=' + this.data.map.latitude +'&longitude='+this.data.map.longitude,
    })
  },
  movetoPosition: function (e) {
    this.data.bb=true;
    this.mapCtx.moveToLocation();
  },
  onShareAppMessage: function () {
    return {
      title: "五台山综合性旅游服务平台",
      imageUrl:"../img/wutai.png" 
      }
  }
})