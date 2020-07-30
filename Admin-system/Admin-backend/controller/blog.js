const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB')
const callCloud = require('../utils/callCloudStorage')

router.get('/list',async(ctx,next) => {
  // 分页获取博客
  const params = ctx.request.query
  const query = `
    db.collection('blog').skip(${params.start}).limit(${params.count}).orderBy('createTime','desc').get()
  `
  const res = await callCloudDB(ctx,'databasequery',query)
  ctx.body = {
    code:20000,
    data: res.data
  }
})

router.post('/del',async(ctx,next) => {
  const params = ctx.request.body
  // 删除博客
  const blogQuery = `db.collection('blog').doc('${params._id}').remove()`
  const blogRes = await callCloudDB(ctx,'databasedelete',blogQuery)
  // 删除评论
  const commentQuery = `db.collection('comment').where({
    blogId:'${params._id}'
  }).remove()`
  const commentRes = await callCloudDB(ctx,'databasedelete',commentQuery)
  // 删除图片
  const picRes = await callCloud.delete(ctx,params.images)
  ctx.body = {
    code:20000,
    data:{
      blogRes,
      commentRes,
      picRes
    }
  }
})

module.exports = router