let movableAreaWidth = 0
let movableViewWidth = 0
let compareSec = 0
// 歌曲总的秒数
let totalSec = 0
// 比率
let ratio = 0
// 互斥锁，因为拖拽导致setData，音乐播放也导致setData，所以要保证拖拽的时候不发生音乐播放导致的setData
let isMoving = false    
const backgroundAudioManager = wx.getBackgroundAudioManager();

Component({
  properties: {
    isSame: Boolean
  },
  data: {
    showtime:{
      currentTime:'00:00',
      totalTime: '00:00'
    },
    movableDist: 0,
    progress: 0
  },
  lifetimes:{
    ready(){
      if(this.properties.isSame && this.data.showtime.totalTime == '00:00'){
        this.setTotalTime()
      }
      // 获取滑动区域宽度和滑块宽度
      this.getMovableWidth()
      // 给播放管理器绑定各种事件
      this.bindManagerEvents()
    }
  },
  methods: {
    resetBar(){
      console.log('重置了')
      this.setData({
        movableDist: 0,
        progress: 0,
        ['showtime.currentTime']:'00:00'
      })
    },
    // 如果是拖拽导致的x坐标改变
    onXchange(event){
      if(event.detail.source == "touch"){  
        isMoving = true
        ratio = event.detail.x / (movableAreaWidth - movableViewWidth) 
        this.data.progress = ratio * 100    // 为了防止可能的频繁触发setData，这里只保存值
        this.data.movableDist = event.detail.x
      }
    },
    // 用户松手后才确定要进行渲染
    onTouchEnd(){    
      isMoving = false  
      let toSec = totalSec * ratio
      this.setData({
        progress:this.data.progress,
        movableDist: this.data.movableDist,
        ['showtime.currentTime']: this.timeFormat(toSec)
      })   
      backgroundAudioManager.seek(toSec)   // 跳转播放位置
    },
     // 获取滑动区域宽度和滑块宽度
    getMovableWidth(){
      const query = this.createSelectorQuery();
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(rect => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },
    // 设置总时长
    setTotalTime(){
      totalSec = backgroundAudioManager.duration
      this.setData({
        ['showtime.totalTime']: this.timeFormat(totalSec)
      })
    },
    // 秒数格式化
    timeFormat(totalSec){
      const min = Math.floor(totalSec / 60)
      const sec = Math.floor(totalSec - min * 60)
      return `${this.parse0(min)}:${this.parse0(sec)}`
    },
    // 加0前缀
    parse0(time){
      return time < 10 ? '0'+time:time
    },
    bindManagerEvents(){
      backgroundAudioManager.onCanplay(() => {
        //console.log('onCanplay')
      })
      backgroundAudioManager.onPlay(() => {
        //console.log('onPlay')
        this.setTotalTime()
        isMoving = false
        this.triggerEvent('musicPlay')
      })
      backgroundAudioManager.onPause(() => {
        this.triggerEvent('musicPause')
      })
      backgroundAudioManager.onStop(() => {

      })
      backgroundAudioManager.onEnded(() => {
        this.triggerEvent('musicEnd')
      })
      backgroundAudioManager.onTimeUpdate(() => {
        // 不拖拽的时候才setData
        if(!isMoving){
          // 设置当前时间
          //let currentTime = backgroundAudioManager.currentTime          
          let currentTime = 0
          if(Math.abs(backgroundAudioManager.currentTime - totalSec * this.data.progress/100) < 2 || this.data.progress == 0){
            //console.log('同步')
            currentTime = backgroundAudioManager.currentTime
          } else {
            //console.log('不同步')
            currentTime = totalSec * this.data.progress/100   
          }
          // 歌词高亮相关
          this.triggerEvent('hightlightLyric',{
            currentTime
          })
          // 获取当前激活时刻
          let sec = currentTime.toString().split('.')[0]
          // 设置movableview进度
          let movableDist = (movableAreaWidth - movableViewWidth) * currentTime / totalSec
          // 设置progress-bar进度
          let progress = 100 * currentTime / totalSec
          // 赋值
          if(compareSec != sec){
            this.setData({
              movableDist,
              progress,
              ['showtime.currentTime']: this.timeFormat(currentTime)
            })
            compareSec = sec
          }
        }
      })
      backgroundAudioManager.onError(res => {
        wx.showToast({
          title: '错误' + res.errCode,
        });
      })
    }
  }
})
