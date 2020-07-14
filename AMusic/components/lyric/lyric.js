// components/lyric/lyric.js
let lyricHeight = 0
Component({
  properties: {
    lyric:String
  },
  observers:{
    lyric(lyc){
      if(lyc == '暂无歌词'){
        this.setData({
          lyricList:[ { eachLyric:'暂无歌词' } ]
        })  
      } else {
        this.parseLyric(lyc)
      }
    }
  },
  data: {
    lyricList: [],
    hightlightIndex: 0,
    scrollTop: 0
  },
  lifetimes:{
    ready(){
      wx.getSystemInfo({
        success: (res)=>{
          lyricHeight = res.screenWidth / 750 * 64
        }
      });
    }
  },
  methods: {
    _hightlightLyric(currentTime){
      if(this.data.lyric == '暂无歌词' || this.data.lyricList.length == 0){
        return 
      }
      let lyricList = this.data.lyricList
      if(currentTime > lyricList[lyricList.length - 1].eachTotalSeconds){
        if(this.data.hightlightIndex != -1){
          this.setData({
            hightlightIndex: -1,
            scrollTop: lyricList.length * lyricHeight
          })
        }
      }
      for(let i = 0;i < lyricList.length;i ++){
        if(currentTime <= lyricList[i].eachTotalSeconds){
          this.setData({
            hightlightIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          console.log('改变高度位置')
          break
        }
      }
    },
    parseLyric(lyric){
      let lyricList = []
      let lineArray = lyric.split('\n')   // 数组每个元素都是一行：时间+歌词
      lineArray.forEach(line => {
        let eachTime = line.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)    // 每一行的时间
        if(eachTime != null){
          let eachLyric = line.split(eachTime)[1]                   // 每一行的歌词
          let eachTimeReg = eachTime[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          let eachTotalSeconds = this.timeToSeconds(eachTimeReg)     // 转化为歌曲的总秒数
          lyricList.push({
            eachTotalSeconds,
            eachLyric
          })
        }
      })
      this.setData({
        lyricList
      })
    },
    timeToSeconds(arr){
      return parseInt(arr[1]) * 60 + parseInt(arr[2]) + parseInt(arr[3]) / 1000
    }
  }
})
