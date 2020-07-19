// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext()

  return await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    page: `/pages/blog-comments/blog-comments?blogId=${event.blogId}`,
    data:{
      thing4:{
        value:'评价完成'
      },
      thing1:{
        value: event.content
      }
    },
    templateId: event.templateId
  })
}