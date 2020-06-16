// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

const TcbRouter = require('tcb-router')

const rp = require('request-promise')
const BASE_URL = 'http://musicapi.xiecheng.live'

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({event})
  // 歌单列表中间件
  app.router('getPlaylist',async(ctx,next) => {
    ctx.body = await db.collection('playlist')
    .skip(event.start)
    .limit(event.limit)
    .orderBy('createTime','desc')
    .get()
    .then(res => {
      return res
     })    
  })
  // 歌曲列表中间件
  app.router('getMusiclist',async(ctx,next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + event.musicid).then(res => {
      return JSON.parse(res).playlist
    })
  })
  return app.serve()
}