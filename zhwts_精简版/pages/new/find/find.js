const app = getApp();
Page({
  data: {
    tabs: ["最新", "热门"],
    imgUrls: [],
    activeIndex: '',
    sliderOffset: 0,
    sliderLeft: 60,
    num: 1, 
    nums:1,
    find_data:{},
    find_list:[],
    find_datas: {},
    find_lists: [],
  },
  onLoad: function (options) {
    wx.getSetting({
      success(res) {
        if (JSON.stringify(res.authSetting) == "{}") {
          wx.navigateTo({
            url: '../../author/author'
          })
        }
      }
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
      that.getViewData("new");
      that.getViewSwiper();
    })
  },
  onShow:function(){
    app.getToken().then(function (res) {
      //这里说明就存上了cat
    })
  },
  tabClick: function (e) {
    var that = this;
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    if (e.currentTarget.id == 0) {
      that.getViewData();
    }
    if (e.currentTarget.id == 1) {
      that.getViewDatas();
    }
  },
  onReachBottom: function (e) {
    if (this.data.activeIndex == 0) {
      var num = this.data.num + 1;
      this.setData({
        num: num
      });
      this.getViewData();
    } else {
      var nums = this.data.nums + 1;
      this.setData({
        nums: nums
      });
      this.getViewDatas();
    }
  },
  getViewSwiper: function () {
    var that = this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
      var cat = wx.getStorageSync('cat');
      wx.request({
        url: app.globalData.publicjs.server_api_url + 'ad/getAd_small',
        method: 'GET',
        data: { tag: 'sylb', access_token: cat },
        success: function (res) {
          if (res.data.code == 1) {
            var data = res.data.data;
            var imgUrls = [];
            for (let i = 0; i < data.length; i++) {
              var d = data[i];
              imgUrls.push({ image: app.globalData.publicjs.datacenter_api_url + d.adcontent.image_url });
            }
            that.setData({
              imgUrls: imgUrls
            });
          }
        }
      });
    })
  },
  getViewData:function(e){
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
      var cat = wx.getStorageSync('cat');
      wx.request({
        url: app.globalData.publicjs.activeserver_api + 'home/wisdowHeadlines',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: { access_token: cat, page: that.data.num, order: "new" },
        success: function (res) {
          if (res.data.code == 1) {
            var data = res.data.data.data;
            var find_list = that.data.find_list;
            for (let i = 0; i < data.length; i++) {
              var d = data[i];
              var imgs = d.imgs;
              var find_data = {};
              find_data.title = d.title;
              find_data.contents = d.contents.replace(/<[^>]+>/, "").replace(/<[^>]+>/g, "\n").replace(/\n\n\n\n|\n\n\n/g, "\n").replace(/&nbsp;/gi, '');
              find_data.id = d.id;
              find_data.hits = d.hits;
              find_data.img = d.imgs;
              if (find_data.img.length > 3) {
                find_data.img.length = 3
              }
              find_data.create_time = d.create_time.slice(0, 10);
              find_list.push(find_data);
            }
            that.setData({
              find_list: find_list
            });
          }
        },
        complete: function (res) {
          wx.hideLoading();
        }
      });
    })
  },
  getViewDatas: function (e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    //验证cat过期没有
    app.getToken().then(function (res) {
      //这里说明就存上了cat
      var cat = wx.getStorageSync('cat');
      wx.request({
        url: app.globalData.publicjs.activeserver_api + 'home/wisdowHeadlines',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: { access_token: cat, page: that.data.nums, order: "hot" },
        success: function (res) {
          if (res.data.code == 1) {
            var data = res.data.data.data;
            var find_lists = that.data.find_lists;
            for (let i = 0; i < data.length; i++) {
              var d = data[i];
              var imgs = d.imgs;
              // if(data)
              var find_datas = {};
              find_datas.title = d.title;
              find_datas.contents = d.contents.replace(/<[^>]+>/, "").replace(/<[^>]+>/g, "\n").replace(/\n\n\n\n|\n\n\n/g, "\n").replace(/&nbsp;/gi, '');
              find_datas.id = d.id;
              find_datas.hits = d.hits;
              find_datas.img = d.imgs;
              if (find_datas.img.length > 3) {
                find_datas.img.length = 3
              }
              find_datas.create_time = d.create_time;
              find_lists.push(find_datas);
            }
            if (that.data.page == 1) {
              that.setData({
                find_lists: []
              });
            } else {
              that.setData({
                find_lists: find_lists
              });
            }
            that.setData({
              find_lists: find_lists
            });
          }
        },
        complete: function (res) {
          wx.hideLoading();
        }
      });
    })
  }
})