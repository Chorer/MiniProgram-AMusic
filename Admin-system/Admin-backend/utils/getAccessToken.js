// 要在后台操作云数据库，需要借助http-api，而http-api又需要携带access-token
// 封装并导出一个可用的getAccessToken函数，每次调用的时候从本地json文件读取最新的access-token
const rp = require('request-promise')
const APPID = ''
const APPSECRET = ''
const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`

const fs = require('fs')
const path = require('path')
const fileName = path.resolve(__dirname,'./accessToken.json')

// 向微信端请求token，并将token写入本地文件
const requestAndWrite = async () => {
  const res = await rp(url)
  const tokenObject = JSON.parse(res)
  if(tokenObject.access_token){
    fs.writeFileSync(fileName,JSON.stringify({
      token: tokenObject.access_token,
      createTime: new Date()
    }))
  } else {
    await requestAndWrite()
  }
}
const getAccessToken = async () => {
  // 如果本地有文件，就读文件
  try {
    const res = fs.readFileSync(fileName,'utf-8')
    const tokenObject = JSON.parse(res)
    // 如果token过期，重新请求获取
    const createTime = new Date(tokenObject.createTime).getTime()
    const nowTime = new Date().getTime()
    console.log(new Date())
    if((nowTime - createTime) / (1000 * 3600) >= 2){
      await requestAndWrite()
      await getAccessToken()
    } 
    return tokenObject.token
  } 
  // 如果本地没有文件，就请求并生成，再去读文件
  catch (error) {
    await requestAndWrite()
    await getAccessToken()
  }
}

// 定期刷新写入最新token
setInterval(async () => {
  await requestAndWrite()
},(7200 - 300) * 1000)


module.exports = getAccessToken

