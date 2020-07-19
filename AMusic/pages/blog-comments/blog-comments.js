import formatTime from '../../utils/formatTime'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogContent:{},
    blogComments:[],
    blogId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      blogId:options.blogId
    })
    this.loadDetail()
  },
  loadDetail(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.callFunction({
      name:'blog',
      data:{
        blogId:this.data.blogId,
        $url:'getDetail',
      }
    }).then(res => {
      wx.hideLoading()
      let blogComments = res.result.blogComments.data
      if(blogComments.length != 0){
        blogComments.forEach(item => {
          item.createTime = formatTime(new Date(item.createTime))
        })
      }
      this.setData({
        blogComments,
        blogContent:res.result.blogContent
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})