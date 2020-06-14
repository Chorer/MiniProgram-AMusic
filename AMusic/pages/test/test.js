// // pages/test/test.js
const db = wx.cloud.database()

Page({
  data:{
    images:[]
  },
  upload(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res){
        const tempFilePaths = res.tempFilePaths
        wx.cloud.uploadFile({
          cloudPath: 'example'+Math.random()+'.png',
          filePath: tempFilePaths[0]
        }).then(res => {
          db.collection('image').add({
            data:{
              fileId:res.fileID
            }
          })   
          wx.showToast({
            title: '上传成功！',
            duration: 1500,
            mask: false
          });         
        })          
      }
    })
  },
  show(){
    wx.cloud.callFunction({
      name:'login'
    }).then(res => {
      return db.collection('image').where({
        _openid:res.result.openid
      }).get()
    }).then(res => {
      this.setData({
        images: res.data
      })
    })
  },
  download(event){
    wx.cloud.downloadFile({
      fileID: event.target.dataset.fileid
    }).then(res => {
      console.log(res)
      wx.saveImageToPhotosAlbum({
        filePath:res.tempFilePath,
        success(res){
          wx.showToast({
            title: '下载成功！',
            duration: 1500,
            mask: true
          });
        }
      })
    })
  },
  getPlaylist(){
    wx.cloud.callFunction({
      name:'getPlaylist'
    })
  },
  clearAll(){
    wx.cloud.callFunction({
      name:'clearAll'
    })
  }
})
