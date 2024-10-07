'use strict';


// 引入log模块
const chalk = require('chalk')

const levels = {
    error: 0,
    warn: 1,
    success: 2,
    info: 3,
    verbose: 4,
    debug: 5,
};


const getLoggerLevelNum = () => {
    return levels[logger.level] || levels.debug
}






const logger = {
    success: (...msg) => {
        if (getLoggerLevelNum() <= levels.success) {
            console.log.apply(console, [chalk.green('\nsuccess:'), ...msg])
        }

    },
    error: (...msg) => {
        if (getLoggerLevelNum() >= levels.error) {
            console.log.apply(console, [chalk.red('\nerror:'), ...msg])
        }

    },
    info: (...msg) => {
        if (getLoggerLevelNum() >= levels.info) {
            console.log.apply(console, ['\ninfo:', ...msg])
        }
    },
    warn: (...msg) => {
        if (getLoggerLevelNum() >= levels.warn) {
            console.log.apply(console, [chalk.yellow('\nwarn:'), ...msg])
        }
    },
    debug: (...msg) => {
        if (getLoggerLevelNum() >= levels.debug) {
            console.log.apply(console, [chalk.blue('\ndebug:'), ...msg])
        }
    },
    verbose: (...msg) => {
        if (getLoggerLevelNum() >= levels.verbose) {
            console.log.apply(console, [chalk.gray('\nverbose:'), ...msg])
        }
    }

}

logger.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'  // 判断debug模式



module.exports = logger;