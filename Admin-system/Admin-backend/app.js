const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
const koaBody = require('koa-body')

// 跨域
app.use(cors({
  origin: function(ctx) { 
    const whiteList = ['']   //可跨域白名单
    let currentUrl = ctx.request.origin     // 获取向服务器发送请求的前端地址
    let changeUrl = currentUrl.substring(0,currentUrl.length - 5)   // 截取掉 host
    if(whiteList.includes(changeUrl)){
        return changeUrl    
    }
    return 'http://localhost:9528'      // 线下开发，本地电脑可以给服务器发送请求
  },
  credentials: true
}))

// 接受post参数
app.use(koaBody({
  multipart:true
}))

const playlist = require('./controller/playlist.js')
const swiper = require('./controller/swiper.js')
const blog = require('./controller/blog.js')
router.use('/playlist',playlist.routes())
router.use('/swiper',swiper.routes())
router.use('/blog',blog.routes())

app.use(router.routes())
app.use(router.allowedMethods())

app.use(async(ctx) => {
  ctx.body = 123
})

app.listen(3000,() => {
  console.log('服务运行在 http://127.0.0.1:3000')
})