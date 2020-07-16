// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isModalShow:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindGetUserInfo(event){
      console.log(event)
      const userInfo = event.detail.userInfo
      if(userInfo){           // 如果允许授权
        this.setData({
          isModalShow: false
        })
        this.triggerEvent('allowAuth',userInfo)
      } else {                // 如果拒绝授权
        this.triggerEvent('disallowAuth')
      }
    }
  }
})
