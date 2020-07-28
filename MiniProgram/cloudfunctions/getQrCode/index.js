// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 生成小程序码图片（二进制格式）
  return cloud.openapi.wxacode.getUnlimited({
    scene: wxContext.OPENID
  }).then(res => {
    // 图片上传到云存储，拿到 fileId
    return cloud.uploadFile({
      cloudPath:'qrcode/' + Date.now() + '-' + Math.random() + '.png',
      fileContent: res.buffer
    })
  }).then(res => {
    return res.fileID
  })
}