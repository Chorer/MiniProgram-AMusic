// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')
const db = cloud.database()

const MAX_SIZE = 2

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  // 获取博客内容，用于展示在博客页 
  app.router('list',async (ctx,next) => {
    let keyword = event.keyword
    let condition = {}
    // 如果传入了关键字
    if(keyword.trim() !== ''){
      condition = {
        textContent: db.RegExp({
          regexp:keyword,
          options:'i'
        })
      }
    }
    ctx.body = await db.collection('blog').where(condition).skip(event.start).limit(event.count)
    .orderBy('createTime','desc').get()
    .then(res => res.data)
  })
  // 获取博客和评论内容，用于展示在详情页 
  app.router('getDetail',async (ctx,next) => {
    let blogId = event.blogId
    
    // 1.获取博客内容
    let blogContent = await db.collection('blog').where({
      _id: blogId
    }).get().then(res => res.data[0])
    
    // 2.获取评论内容
    let blogComments = {
      data:[]
    }
    let promiseTasks = []
    const sum = await db.collection('comment').count().then(res => res.total)
    const searchTimes = Math.ceil(sum / MAX_SIZE)
    if(sum > 0){
      for(let i = 0;i < searchTimes;i ++){
        let promise = await db.collection('comment').skip(i * MAX_SIZE).limit(MAX_SIZE)
        .where({
          blogId
        })
        .orderBy('createTime','desc').get()
        promiseTasks.push(promise)
      }
      if(promiseTasks.length > 0){
        //console.log(blogComments)
        await Promise.all(promiseTasks).then(res => {
          blogComments = res.reduce((acc,cur) => {
            return {
              data: acc.data.concat(cur.data)
            }
          })
        })     
      }     
    }
    ctx.body = {
      blogContent,
      blogComments
    }
  })  
  return app.serve()
}