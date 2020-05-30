"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var https = __importStar(require("https"));
var MD5 = require("md5");
var private_1 = require("./private");
function translate(word) {
    var salt = Math.random();
    var isEnglish = /[a-zA-Z]/.test(word);
    var options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: "/api/trans/vip/translate?q=" + (isEnglish ? word : encodeURIComponent(word)) + "&from=" + (isEnglish ? 'en' : 'zh') + "&to=" + (isEnglish ? 'zh' : 'en') + "&appid=" + private_1.appId + "&salt=" + salt + "&sign=" + MD5(private_1.appId + word + salt + private_1.key),
        method: 'GET',
    };
    var request = https.request(options, function (res) {
        var str = '';
        res.on('data', function (data) {
            str += data;
        });
        res.on('end', function () {
            var result = JSON.parse(str);
            console.log(result.trans_result.map(function (item) { return item.dst; }).join(','));
            process.exit(0);
        });
    });
    request.on('error', function (e) {
        console.error(e);
    });
    request.end();
}
exports.translate = translate;
