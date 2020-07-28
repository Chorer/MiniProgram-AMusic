Page({
  addData(){
    wx.cloud.callFunction({
      name:'aaa',
      data:{
        job:'worker',
        name:'jack'
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }
})
