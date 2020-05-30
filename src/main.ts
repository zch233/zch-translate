import * as https from 'https'

const options = {
  hostname: 'api.fanyi.baidu.com',
  port: 443,
  path: '/api/trans/vip/translate?',
  mthod: 'GET'
};

const request = https.request(options, res => {
  console.log(res)
  res.on('end', () => {
    process.exit(0)
  })
  request.end()
})