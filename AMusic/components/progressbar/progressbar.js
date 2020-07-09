let movableAreaWidth = 0
let movableViewWidth = 0
let compareSec = 0
const backgroundAudioManager = wx.getBackgroundAudioManager();

Component({
  properties: {

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
      // 获取滑动区域宽度和滑块宽度
      this.getMovableWidth()
      // 给播放管理器绑定各种事件
      this.bindManagerEvents()
    }
  },
  methods: {
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
      let totalSec = backgroundAudioManager.duration
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

      })
      backgroundAudioManager.onPlay(() => {
        this.setTotalTime()
      })
      backgroundAudioManager.onPause(() => {

      })
      backgroundAudioManager.onStop(() => {

      })
      backgroundAudioManager.onEnded(() => {

      })
      backgroundAudioManager.onTimeUpdate(() => {
        // 设置当前时间
        let currentTime = backgroundAudioManager.currentTime
        // 获取当前激活时刻
        let sec = currentTime.toString().split('.')[0]
        // 设置movableview进度
        let movableDist = (movableAreaWidth - movableViewWidth) * currentTime / backgroundAudioManager.duration
        // 设置progress-bar进度
        let progress = 100 * currentTime / backgroundAudioManager.duration
        // 赋值
        if(compareSec != sec){
          this.setData({
            movableDist,
            progress,
            ['showtime.currentTime']: this.timeFormat(currentTime)
          })
          compareSec = sec
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
