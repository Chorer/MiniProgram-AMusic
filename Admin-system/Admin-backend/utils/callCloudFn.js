const getAccessToken = require('../utils/getAccessToken.js')
const rp = require('request-promise')

const callCloudFn = async (ctx,fnName,params) => {
  const token = await getAccessToken()
  const options = {
    method:'POST',
    uri:`https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${token}&env=test-c469p&name=${fnName}`,
    body:{
      ...params
    },
    json: true
  }
  return await rp(options).then(res => {
    return res
  }).catch(err => {

  })
}

module.exports = callCloudFn