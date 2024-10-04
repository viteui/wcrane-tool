'use strict';

const { on } = require('stream');
const fs = require('fs');

const cp = require("child_process");


function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]'
}


function spinnerStart(msg, spinnerString = '|/-\\') {
    var Spinner = require('cli-spinner').Spinner;

    var spinner = new Spinner(msg + ' %s');
    spinner.setSpinnerString(spinnerString);
    spinner.start();
    return spinner;
}

//  停止执行1S
function sleep(timeout = 1000) {
    return new Promise(resolve => setTimeout(resolve, timeout))
}


function exec(command, args, options) {
    const win32 = process.platform === 'win32';
    const cmd = win32 ? 'cmd' : command;
    const cmdArgs = win32 ? ['/c'].concat(command, args) : args;
    //  在windows 下的结构  cp.spawn("cmd",['/c' ,'node','-e','console.log(1)'])

    return cp.spawn(cmd, cmdArgs, options || {})

}

function execAsync(command, args, options) {
    return new Promise((resolve, reject) => {
        const p = exec(command, args, options)
        p.on('error', reject)
        p.on('exit', resolve)
    })
}


//  阅读文件
function readFile(path, options = {}) {

    if (fs.existsSync(path)) {
        const buffer = fs.readFileSync(path);
        if (buffer) {
            if (options.toJson) {
                return buffer.toJSON();
            } else {
                return buffer.toString();
            }
        }
    }
    return null;
}


function writeFile(path, data, { rewrite = true } = {}) {
    if (fs.existsSync(path)) {
        if (rewrite) {
            fs.writeFileSync(path, data);
            return true
        }
        return false
    } else {
        fs.writeFileSync(path, data);
    }
}
module.exports = {
    isObject,
    spinnerStart,
    sleep,
    exec,
    execAsync,
    readFile,
    writeFile
};
