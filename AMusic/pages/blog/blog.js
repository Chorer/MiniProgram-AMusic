// pages/blog/blog.js
Page({
  data: {
    isModalShow: false
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
  }
})