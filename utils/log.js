'use strict';


// 引入log模块
const chalk = require('chalk')

const logger = {
    success: (...msg) => {
        console.log.apply(console, [chalk.green('success:'), ...msg])
    },
    error: (...msg) => {
        console.log.apply(console, [chalk.red('error:'), ...msg])
    },
    info: (...msg) => {
        console.log.apply(console, [chalk.blue('info:'), ...msg])
    },
    warn: (...msg) => {
        console.log.apply(console, [chalk.yellow('warn:'), ...msg])
    },

}

module.exports = logger;