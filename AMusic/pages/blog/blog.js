let keyword = ''

Page({
  data: {
    isModalShow: false,
    blogList:[],
    isTextShow: false
  },
  onLoad(){
    this.loadBlog()
  },
  loadBlog(start = 0){
    wx.showLoading({
      title:'加载中'
    });
    wx.cloud.callFunction({
      name:'blog',
      data:{
        keyword,
        start,
        $url:'list',
        count:4
      }
    }).then(res => {
      // 记录之前长度
      let prelength = this.data.blogList.length
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      // 如果长度没变化，说明数据已经全部请求完了
      if(prelength == this.data.blogList.length){
        console.log(777)
        this.setData({
          isTextShow:true
         })
      }
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  // 发布博客功能
  onPublish(){
    wx.getSetting({                           // 判断授权情况
      success:res => {
        if(res.authSetting['scope.userInfo']){           // 如果之前授权过
          wx.getUserInfo({
            success: res => {
              this.allowAuth({
                detail:res.userInfo
              })
            }
          })
        } else {             // 如果之前没有授权过
          this.setData({
            isModalShow: true
          })
        }
      }
    })
  },
  allowAuth(event){
    const userInfo = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${userInfo.nickName}&avatarUrl=${userInfo.avatarUrl}`,
    });
  },
  disallowAuth(){
    wx.showModal({
      title: '必须同意授权才能发布博客',
      content: ''
    });
  },
  onPullDownRefresh(){
    this.setData({
      blogList:[]
    })
    this.loadBlog(0)
  },
  onReachBottom(){
    wx.showLoading({
      title: '拼命加载中'
    });
    this.loadBlog(this.data.blogList.length)
  },
  goComments(event){
    console.log(event)
    wx.navigateTo({
      url: `../blog-comments/blog-comments?blogId=${event.target.dataset.blogid}`
    });
  },
  onSearch(event){
    keyword = event.detail.keyword
    this.setData({
      blogList:[]
    })
    this.loadBlog(0)
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