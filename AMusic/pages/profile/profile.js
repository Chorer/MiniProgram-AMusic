// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getQrCode(){
    wx.showLoading({
      title: '生成中',
      mask: true
    });
    wx.cloud.callFunction({
      name:'getQrCode',
    }).then(res => {
      const fileId = res.result
      wx.previewImage({
        current: fileId,
        urls: [fileId]
      })
      wx.hideLoading()
    })
  }
})