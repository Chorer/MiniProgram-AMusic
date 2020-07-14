// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

const rp = require('request-promise')
const URL = 'http://musicapi.xiecheng.live/personalized'
const MAX_LIMIT = 50

// 云函数入口函数
exports.main = async (event, context) => {
  // 1.数据库已有的数据
  // 这个方法一次只能拿100条，放弃：const existedlist = await db.collection('playlist').get().then(res => res.data)
  // 多次请求
  const total = await db.collection('playlist').count().then(res => res.total)
  const times = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for(let i = 0;i < times;i++) {   // 并发请求
    let promise = db.collection('playlist').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let existedlist = []
  if(tasks.length > 0){
    let result = await Promise.all(tasks)
    existedlist = result.reduce((acc,cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    }).data
  }
  // 2.新请求的数据
  const playlist = await rp(URL).then(res => {
    return JSON.parse(res).result
  })
  // 3.数据去重
  const itemNotInArray = (item,arr) => arr.every(item2 => item2.id != item.id)
  const newlist = playlist.filter(item => itemNotInArray(item,existedlist))
  // 4.新增数据存入数据库中
  if(newlist){
    newlist.forEach(item => {
      db.collection('playlist').add({
        data:{
          ...item,
          createTime:db.serverDate()
        }
      })
    })
  }
}