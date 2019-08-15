// pages/new/me/app/app.js
Page({
  xiazai: function () {
    var that = this;
    wx.showModal({
      content: '您确定要下载APP吗？',
      showCancel: true,//是否显示取消按钮
      confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          wx.getSystemInfo({
            success: function (res) {
              that.setData({
                systemInfo: res
              })
              if (res.platform == "devtools") {
              } else if (res.platform == "ios") {
                wx.showToast({
                  title: '苹果手机请到应用商店下载',
                  icon: 'none',
                  duration: 2000
                })
              } else if (res.platform == "android") {
                wx.navigateTo({
                  url: '../xia/xia'
                })
              }
            }
          })
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
    

  }
})