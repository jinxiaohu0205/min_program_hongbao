Page({
  data: {
    
  },
  onLoad: function (options) {
    wx.showToast({
      title: '下载中',
      icon: 'success',
      duration: 2000
    })
    setTimeout(function () {
      wx.navigateBack({})
    }, 2000) 


  }
})