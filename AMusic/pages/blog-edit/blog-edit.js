const MAX_WORD_LENGTH = 140
const MAX_IMG_LENGTH = 9

const db = wx.cloud.database()

let textContent = ''
let userInfo = {}

Page({
  data: {
    wordsNum:0,
    footerBottom:0,
    images:[]
  },
  onLoad(options){
    userInfo = options
  },
  onInput(event){
    let wordsNum = event.detail.value.length
    if(wordsNum >= MAX_WORD_LENGTH){
      wordsNum = '最多输入140字'
    }
    this.setData({
      wordsNum
    })
    textContent = event.detail.value
  },
  onFocus(event){
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur(){
    this.setData({
      footerBottom:0
    })
  },
  onChooseImg(){
    let extraNum = MAX_IMG_LENGTH - this.data.images.length
    wx.chooseImage({
      count: extraNum,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (res)=>{
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
      },
    });
  },
  onDeleteImg(event){
    const imgIndex = event.target.dataset.index
    this.data.images.splice(imgIndex,1)
    this.setData({
      images: this.data.images
    })
  },
  onPreviewImg(event){
    wx.previewImage({
      current: event.target.dataset.src,
      urls: this.data.images
    });
  },
  onPublish(){
    //   检查是否有文字
    if(textContent.trim() === ''){
      wx.showModal({
        title: '不能发表空内容',
        content: ''
      });
      return
    }

    wx.showLoading({
      title: '发布中',
      mask: true
    });
    let promiseTasks = []    
    // 1.上传图片到云存储，拿到fileID
    this.data.images.forEach(item => {
      // 拿到文件拓展名
      let promise = new Promise((resolve,reject) => {
        let fileType = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: `blog/${Date.now()}-${Math.random() * 1000}${fileType}`,
          filePath: item,
          success:res => {
            resolve(res.fileID)
          },
          fail: err => {
            reject()
          }
        })        
      })
      promiseTasks.push(promise)
    })

    // 2.上传数据到数据库
    Promise.all(promiseTasks).then(res => {
      db.collection('blog').add({
        data:{
          ...userInfo,
          textContent,
          images:res,
          createTime: db.serverDate()
        }
      })
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '发布成功',
      })
      wx.navigateBack()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
        icon:'none'
      });
    })
  }
})