// components/musiclist/musiclist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentId: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toPlayer(event){
      const ds = event.currentTarget.dataset
      this.setData({
        currentId: ds.musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicid=${ds.musicid}&index=${ds.index}`
      });
    }
  }
})
