const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
const koaBody = require('koa-body')

// 跨域
app.use(cors({
  origin:['http://localhost:9528'],
  credentials: true
}))

// 接受post参数
app.use(koaBody({
  multipart:true
}))

const playlist = require('./controller/playlist.js')
const swiper = require('./controller/swiper.js')
router.use('/playlist',playlist.routes())
router.use('/swiper',swiper.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.use(async(ctx) => {
  ctx.body = 'Hello World'
})

app.listen(3000,() => {
  console.log('服务运行在 http://127.0.0.1:3000')
})