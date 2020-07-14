const app =  getApp();


Component({
  properties: {
    musiclist: Array
  },
  data: {
    currentId: -1
  },
  pageLifetimes:{
    show(){
      this.setData({
        currentId: parseInt(app.getCurrentMusicId())
      })
    }
  },
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
