const MAX_SIZE = 4

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bloglist:[],
    isEmptyShow: false,
    isTextShow: false
  },
  onLoad: function (options) {
    this.getBloglistByOpendId()
  },
  getBloglistByOpendId(){
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    wx.cloud.callFunction({
      name:'blog',
      data:{
        $url:'getBloglistByOpendId',
        start: this.data.bloglist.length,
        limit: MAX_SIZE
      }
    }).then(res => {
      wx.hideLoading()
      // 记录之前长度
      let prelength = this.data.bloglist.length
      this.setData({
        bloglist: this.data.bloglist.concat(res.result)
      })
      if(this.data.bloglist.length == 0){
        this.setData({
          isEmptyShow: true
        })
      } else if(prelength == this.data.bloglist.length){
        this.setData({
         isTextShow:true
        })
       }
    })
  },
  goComments(event){
    wx.navigateTo({
      url: `../blog-comments/blog-comments?blogId=${event.target.dataset.blogid}`
    });
  },
  onReachBottom: function () {
    this.getBloglistByOpendId()
  },
  onShareAppMessage(event){
    const blog = event.target.dataset.blog
    return {
      title: blog.textContent,
      path: `/pages/blog-comments/blog-comments?blogId=${blog._id}`,
      imageUrl: blog.images[0]
    }
  }
})