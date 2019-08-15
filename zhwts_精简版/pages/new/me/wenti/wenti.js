
const app = getApp();
Page({
  data: {
    arr:[]
  },
  onLoad: function (options) {
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
        url: app.globalData.publicjs.server_Redenvelope_urls + 'User/problem',
        method: 'post',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          access_token: uat
        },
        success: function (res) {
          that.setData({
            arr:res.data.data
          })
        }
      })
    })
  }, 
  detail1:function(){
    var show1 = !this.data.show1
    this.setData({
      show1: show1
    }) 
    if (show1){
      this.setData({
        show2: false
      })
    }
  },
  detail2: function () {
    var show2 = !this.data.show2
    this.setData({
      show2: show2
    })
    if (show2) {
      this.setData({
        show1: false
      })
    }
  }
})