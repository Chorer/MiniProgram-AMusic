const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB')
const callCloud = require('../utils/callCloudStorage')

router.get('/list',async(ctx,next) => {
  const query = `db.collection('swiper').get()`
  const res = await callCloudDB(ctx,'databasequery',query)
  const data = res.data
  // 根据fileid生成对应的文件下载链接
  let fileList = []
  data.forEach(item => {
    fileList.push({
      fileid: JSON.parse(item).fileid,
      max_age: 7200
    })
  })
  const _res = await callCloud.download(ctx,fileList)
  let returnList = []
  _res.file_list.forEach((item,index) => {
    returnList.push({
      fileid: item.fileid,
      download_url: item.download_url,
      id: JSON.parse(data[index])._id
    })
  })
  ctx.body = {
    code: 20000,
    data: returnList
  }
})

router.post('/upload',async(ctx,next) => {
  // 1. 上传云存储
  const fileid = await callCloud.upload(ctx)
  // 2. 写入数据库
  const query = `
    db.collection('swiper').add({
      data:{
        fileid: '${fileid}'
      }
    })
  `
  const res = await callCloudDB(ctx,'databaseadd',query)
  ctx.body = {
    code:20000,
    id_list: res.id_list
  }
})

router.get('/del',async(ctx,next) => {
  const params = ctx.request.query
  // 1. 删除数据库数据
  const query = `db.collection('swiper').doc('${params.id}').remove()`
  const delDBRes = await callCloudDB(ctx,'databasedelete',query)
  // 2. 删除云存储图片
  const delStorageRes = await callCloud.delete(ctx,[params.fileid])

  ctx.body = {
    code:20000,
    data:{
      delDBRes,
      delStorageRes
    }
  }
})

module.exports = router