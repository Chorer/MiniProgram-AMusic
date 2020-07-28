const getAccessToken = require('./getAccessToken.js')
const rp = require('request-promise')
const fs = require('fs')

const callCloud = {
  async download(ctx,fileList) {
    const token = await getAccessToken()
    const options = {
      method:'POST',
      uri: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${token}`,
      body:{
        env: 'test-c469p',
        file_list: fileList
      },
      json: true
    }
    return await rp(options).then(res => {
      return res
    }).catch(err => {

    })
  },
  async upload(ctx) {
    // 1. 发送请求，从返回的json数据包中提取 上传链接
    const token = await getAccessToken()
    const file = ctx.request.files.file
    const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`
    const options = {
      method:'POST',
      uri:`https://api.weixin.qq.com/tcb/uploadfile?access_token=${token}`,
      body:{
        path,
        env: 'test-c469p',
      },
      json:true
    }
    const info = await rp(options).then(res => {
      return res
    }).catch(err => {

    })
    console.log(info)
    // 2. 向上传链接发送请求，上传文件到云存储
    const params = {
      method:'POST',
      headers:{
        'content-type':'multipart/form-data'
      },
      uri: info.url,
      formData:{
        key: path,
        Signature:info.authorization,
        'x-cos-security-token':info.token,
        'x-cos-meta-fileid':info.cos_file_id,
        file: fs.createReadStream(file.path)
      },
      json:true
    }
    await rp(params)

    // 返回fileid
    return info.file_id
  },
  async delete(ctx,fileList) {
    const token = await getAccessToken()
    const options = {
      method:'POST',
      uri: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${token}`,
      body:{  
        fileid_list:fileList,
        env: 'test-c469p',
      },
      json:true
    }
    return await rp(options).then(res => {
      return res
    }).catch(err => {
      
    })
  }
}

module.exports = callCloud