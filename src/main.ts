import * as https from 'https'
import MD5 = require('md5')
import { appId, key } from './private'

interface ErrorMap {
  [key: string]: string
}
const errorMap: ErrorMap = {
  52003: '用户认证失败',
  54001: '签名错误',
  54004: '账户余额不足',
}

export function translate (word: string) {
  const salt = Math.random()
  const isEnglish: boolean = /[a-zA-Z]/.test(word)
  interface Option {
    hostname: string;
    port: number;
    path: string;
    method: string;
  }
  const options: Option = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: `/api/trans/vip/translate?q=${isEnglish ? word : encodeURIComponent(word)}&from=${isEnglish ? 'en' : 'zh'}&to=${isEnglish ? 'zh' : 'en'}&appid=${appId}&salt=${salt}&sign=${MD5(appId + word + salt + key)}`,
    method: 'GET',
  };
  const request = https.request(options, res => {
    let str: string = ''
    res.on('data', (data: Buffer) => {
      str += data
    })
    res.on('end', () => {
      interface Result {
        error_code?: string;
        error_msg?: string;
        from: string;
        to: string;
        trans_result: { src: string, dst: string }[];
      }
      const result: Result = JSON.parse(str)
      if (result.error_code) {
        console.log(errorMap[result.error_code] || result.error_msg)
        process.exit(1)
      } else {
        console.log(result.trans_result.map(item => item.dst).join(','))
        process.exit(0)
      }
    })
  })
  request.on('error', (e) => {
    console.error(e);
  })
  request.end()
}
