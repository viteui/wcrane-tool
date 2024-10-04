'use strict';


// 引入log模块
const log = require('npmlog')

//   修改 handing
log.headingStyle = { fg: 'white', bg: 'black' };
log.heading = "wcrane"   // 修改前缀
//  debug 模式定制
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'  // 判断debug模式
log.addLevel("success", 2000, { fg: "green", bold: true })

module.exports = log;