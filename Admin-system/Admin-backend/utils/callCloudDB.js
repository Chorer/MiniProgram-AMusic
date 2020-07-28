const getAccessToken = require('./getAccessToken.js')
const rp = require('request-promise')


const callCloudDB = async (ctx,fnName,query = {}) => {
  const token = await getAccessToken()
  const options = {
    method:'POST',
    uri:`https://api.weixin.qq.com/tcb/${fnName}?access_token=${token}`,
    body:{
      query,
      env: 'test-c469p'
    },
    json: true
  }
  return await rp(options).then(res => {
    return res
  }).catch(err => {

  })
}

module.exports = callCloudDB