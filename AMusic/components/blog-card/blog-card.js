import formatTime from '../../utils/formatTime.js'

Component({
  properties: {
    blog:Object
  },
  observers:{
    ['blog.createTime'](val){
      if(val){
        this.setData({
          _createTime: formatTime(new Date(val))
        })        
      }
    }
  },
  data: {
    _createTime:''
  },
  methods: {
    onPreviewImg(event){
      wx.previewImage({
        current: event.target.dataset.src,
        urls: this.data.blog.images
      });
    }
  }
})
