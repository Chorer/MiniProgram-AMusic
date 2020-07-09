let musiclist = []
let nowIndex = 0
let backgroundAudioManager = wx.getBackgroundAudioManager();

Page({
  data: {
    picUrl:'',
    isPlaying: false
  },
  onLoad: function (options) {
    musiclist = wx.getStorageSync('musiclist')
    nowIndex = options.index
    this.loadSongInfo()
  },
  loadSongInfo(){
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let songInfo = musiclist[nowIndex]
    let nowId = songInfo.id
    // 设置歌曲顶部标题
    wx.setNavigationBarTitle({
      title: songInfo.name
    })
    //  设置歌曲大背景
    this.setData({
      picUrl: songInfo.al.picUrl
    })
    // 请求歌曲播放链接
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:'getMusicUrl',
        musicId:nowId
      }
    }).then(res => {
      let musicUrl = JSON.parse(res.result).data[0].url
      backgroundAudioManager.src = musicUrl
      backgroundAudioManager.title = songInfo.name
      backgroundAudioManager.coverImgUrl = songInfo.al.picUrl
      backgroundAudioManager.singer = songInfo.ar[0].name
      backgroundAudioManager.epname = songInfo.al.name
      this.setData({
        isPlaying: true
      })
      wx.hideLoading();
    })
  },
  toggleState(){
    if(this.data.isPlaying){
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  preMusic(){
    backgroundAudioManager.stop()
    nowIndex--
    if(nowIndex < 0) {
      nowIndex = musiclist.length - 1
    }
    this.loadSongInfo()
  },
  nextMusic(){
    backgroundAudioManager.stop()
    nowIndex++
    if(nowIndex == musiclist.length) {
      nowIndex = 0
    }
    this.loadSongInfo()
  }
})