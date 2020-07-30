const LIMIT = 15
const db = wx.cloud.database()

Page({
  data: {
    swiperImgUrl:[
      // {
      //   url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      // },
      // {
      //   url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      // },
      // {
      //   url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      // }
    ],
    cardInfo:[]
  },
  onLoad: function (options) {
    this._getPlaylist()
    this._getSwiper()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    this.setData({
      cardInfo:[],
      swiperImgUrl:[]

    })
    this._getPlaylist()
    this._getSwiper()
  },
  onReachBottom: function () {
    this._getPlaylist()
  },
  onShareAppMessage: function () {

  },
  _getPlaylist(){
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:'getPlaylist',
        start: this.data.cardInfo.length,
        limit: LIMIT
      }
    }).then(res => {
      this.setData({
        cardInfo:this.data.cardInfo.concat(res.result.data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading();
    })
  },
  _getSwiper(){
    db.collection('swiper').get().then(res => {
      this.setData({
        swiperImgUrl: res.data
      })
    })
  }
})