let musiclist = []
let nowIndex = 0
// pages/player/player.js
Page({
  data: {
    picUrl:''
  },
  onLoad: function (options) {
    musiclist = wx.getStorageSync('musiclist')
    nowIndex = options.index
    this.loadSongInfo()
  },
  loadSongInfo(){
    let songInfo = musiclist[nowIndex]
    wx.setNavigationBarTitle({
      title: songInfo.name
    })
    this.setData({
      picUrl: songInfo.al.picUrl
    })
  }
})