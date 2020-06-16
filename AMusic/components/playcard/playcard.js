Component({
  properties: {
    cardInfo:{
      type:Object
    }
  },
  data: {
    realNum: 0
  },
  observers:{
    ['cardInfo.playCount'](num) {
      this.setData({
        realNum:this.transNum(num,2)
      })
    }
  },
  methods: {
    transNum(num,point){
      let numStr = parseInt(num).toString()  // 去除小数点并转化为字符串
      let leftInt,rightPoint
      if(numStr.length < 6) {
        return num
      } else if (numStr.length >= 6 && numStr.length <= 8) {
        leftInt = parseInt(num / 10000)
        rightPoint = numStr.substring(numStr.length - 4,numStr.length - 4 + point)
        return parseFloat(leftInt + '.' + rightPoint) + '万'
      } else if (numStr.length > 8) {
        leftInt = parseInt(num / 100000000)
        rightPoint = numStr.substring(numStr.length - 8,numStr.length - 8 + point)
        return parseFloat(leftInt + '.' + rightPoint) + '亿'
      }
    },
    toMusiclist(){
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?musicid=${this.properties.cardInfo.id}`
      });
    }
  }
})
