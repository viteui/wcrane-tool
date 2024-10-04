const fs = require('fs');
const path = require('path');
const log = require('../../utils/log');
const { spinnerStart } = require('../../utils');
const configTemplate = `{
    // 发布目录
    root: ".",
    // 是否同步git
    syncGit: true,
    // 是否同步git tag
    syncGitTag: true,
    // 升级版本号的等级
    versionLevel: 'patch', // major | minor | patch
    // 自定义发布
    customPublish: false,
    // git 仓库根目录, 不填写则跟root一致
    gitRoot: '.',
    // 发布前执行
    before(config) {
        // console.log(config)
    },
    // 发布后执行
    after(config) {
        // console.log(config)
    },
    // git tag 格式
    gitTagFormat: (version) => {
        return \`v\${version}\`
    },
}
`

const esmTemplate = `export default${configTemplate}
`

const commonTemplate = `module.exports = ${configTemplate}
`
module.exports = async function init() {
    const initSpinner = spinnerStart("initing...")
    // 获取当前终端指令的目录
    const cwdPath = process.cwd();
    // 创建默认配置文件
    // 判断 当前类型是什么
    // 获取当前目录下的package.json  的type字段，如果是module，则使用esm
    const pkgJson = JSON.parse(fs.readFileSync(path.resolve(cwdPath, './package.json')));
    const type = pkgJson.type || 'commonjs';
    log.info("node type: " + type)
    // 不存在的话 在当前目录下创建一个 publish.config.js文件
    if (!fs.existsSync(path.resolve(cwdPath, './publish.config.js'))) {
        if (type === 'module') {
            fs.writeFileSync(path.resolve(cwdPath, './publish.config.js'), esmTemplate, 'utf-8');
        } else {
            fs.writeFileSync(path.resolve(cwdPath, './publish.config.js'), commonTemplate, 'utf-8');
        }
        log.success(`${type} publish.config.js created successfully`)


    } else {
        log.warn('publish.config.js 已存在')
    }
    initSpinner.stop()

    log.success('init success')


}