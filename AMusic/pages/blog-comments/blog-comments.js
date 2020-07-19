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
  onShareAppMessage(){
    const blog = this.data.blogContent
    return {
      title: blog.textContent,
      path: `/pages/blog-comments/blog-comments?blogId=${this.data.blogId}`,
      imageUrl: blog.images[0]
    }
  }
})