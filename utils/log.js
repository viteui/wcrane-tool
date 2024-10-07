'use strict';


// 引入log模块
const chalk = require('chalk')

const logger = {
    success: (...msg) => {
        console.log.apply(console, [chalk.green('\nsuccess:'), ...msg])
    },
    error: (...msg) => {
        console.log.apply(console, [chalk.red('\nerror:'), ...msg])
    },
    info: (...msg) => {
        console.log.apply(console, [chalk.blue('\ninfo:'), ...msg])
    },
    warn: (...msg) => {
        console.log.apply(console, [chalk.yellow('\nwarn:'), ...msg])
    },

}

module.exports = logger;