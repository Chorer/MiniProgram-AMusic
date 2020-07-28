let userInfo = {}
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogid: String,
    blog:Object
  },
  options:{
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的初始数据
   */
  data: {
    isLoginShow: false,
    isCommentShow:false,
    textContent:'',
    bottomValue: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment(){
      wx.getSetting({
        success: (res)=>{
          // 如果之前授权过
          if(res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success:res => {
                userInfo = res.userInfo
                // 显示评论框
                this.setData({
                  isCommentShow: true
                })
              }
            })
          } else {
            this.setData({
              // 显示登录框
              isLoginShow: true
            })
          }
        }
      });
    },
    onAllowAuth(event){
      this.setData({
        isLoginShow: false
      },() => {
        this.setData({
          isCommentShow: true
        })
      })
      userInfo = event.detail
    },
    onDisallowAuth(){
      wx.showModal({
        title: '必须授权才能评论',
        content: ''
      });
    },
    onInput(event){
      this.setData({
        textContent: event.detail.value
      })
    },
    onSend(){
      // 检查是否是空评论
      if(this.data.textContent.trim() == ''){
        wx.showModal({
          title: '评论内容不能为空',
          content: ''
        })
        return
      }
      // 发送评论
      wx.showLoading({
        title: '发送中',
        mask: true
      });      
      db.collection('comment').add({
        data:{
          content: this.data.textContent,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          createTime: db.serverDate(),
          blogId:this.properties.blogid
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功'
        })
        this.setData({
          isCommentShow: false
        })
        this.triggerEvent('refreshComment')
      })
      // 询问用户是否接受消息推送
      let templateId = 'Iet6-mnfTlONu6rd35AJ-SGQYKQgj1WMvjVj0O5h9kE'
      wx.requestSubscribeMessage({
        tmplIds: [templateId],
        success: (res)=> {
          // 如果用户点击允许
          if(res[templateId] == 'accept'){
            console.log('点击了允许')
            wx.cloud.callFunction({
              name:'sendMessage',
              data:{
                templateId,
                content: this.data.textContent,
                blogId: this.properties.blogid,
              }
            }).then(res => {                      
              this.setData({
                textContent:''
              })
            })
          } else {
            console.log('点击了取消')
          }
        }
      })     
    }
  }
})
