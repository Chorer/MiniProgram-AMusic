let musiclist = []
let nowIndex = 0
let backgroundAudioManager = wx.getBackgroundAudioManager();
const app =  getApp();


Page({
  data: {
    picUrl:'',
    isPlaying: false,
    isLyric: false,
    lyric: '',
    isSame: false
  },
  onLoad: function (options) {
    musiclist = wx.getStorageSync('musiclist')
    nowIndex = options.index
    this.loadSongInfo()
  },
  savePlayHistory(){
    const currentMusic = musiclist[nowIndex]
    const openId = app.globalData.openId
    const userHistory = wx.getStorageSync(openId)
    // 如果本地存储没有该歌曲的播放历史
    if(userHistory.filter(item => item.id == currentMusic.id).length == 0){
      userHistory.unshift(currentMusic)
      wx.setStorage({
        key: openId,
        data: userHistory
      })
    }
  },
  loadSongInfo(){
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    // 获取歌曲id
    let songInfo = musiclist[nowIndex]
    let nowId = songInfo.id

    // 防止后退再进入的时候重新加载歌曲
    this.setData({
      isSame: nowId == app.getCurrentMusicId()
    })    
    if(!this.data.isSame){
      backgroundAudioManager.stop()
    }
    // 设置歌曲顶部标题
    wx.setNavigationBarTitle({
      title: songInfo.name
    })
    //  设置歌曲大背景
    this.setData({
      picUrl: songInfo.al.picUrl
    })
    // 设置全局变量记录当前歌曲id
    app.setCurrentMusicId(nowId)    
    // 请求歌曲播放链接
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:'getMusicUrl',
        musicId:nowId
      }
    }).then(res => {
      let musicUrl = JSON.parse(res.result).data[0].url
      if(!this.data.isSame){
        backgroundAudioManager.src = musicUrl
        backgroundAudioManager.title = songInfo.name
        backgroundAudioManager.coverImgUrl = songInfo.al.picUrl
        backgroundAudioManager.singer = songInfo.ar[0].name
        backgroundAudioManager.epname = songInfo.al.name        
      }
      this.savePlayHistory()
      this.setData({
        isPlaying: true
      })
      wx.hideLoading();
      // 请求歌词
      wx.cloud.callFunction({
        name:'music',
        data:{
          $url: 'getLyric',
          musicId: nowId
        }
      }).then(res => {
        let lyric = '暂无歌词'
        const lrc = JSON.parse(res.result).lrc
        if(lrc){
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    }).catch(err => {
      wx.showLoading({
        title: '播放错误',
      });
      setTimeout(() => {
        this.nextMusic()
        wx.hideLoading()
       },1000)
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
    // 防止超出索引
    nowIndex--
    if(nowIndex < 0) {
      nowIndex = musiclist.length - 1
    }
    this.selectComponent('#m-progressbar').resetBar()       // 重置进度条
    this.loadSongInfo()   // 加载新歌曲
  },
  nextMusic(){
    backgroundAudioManager.stop()
    // 防止超出索引
    nowIndex++
    if(nowIndex == musiclist.length) {
      nowIndex = 0
    }
    this.selectComponent('#m-progressbar').resetBar()      // 重置进度条
    this.loadSongInfo()   // 加载新歌曲
  },
  discOrLyric(){
    this.setData({
      isLyric: !this.data.isLyric
    })
  },
  hightlightLyric(event){
    this.selectComponent('#m-lyric')._hightlightLyric(event.detail.currentTime)
  },
  musicPlay(){
    this.setData({
      isPlaying: true
    })
  },
  musicPause(){
    this.setData({
      isPlaying: false
    })
  }
})