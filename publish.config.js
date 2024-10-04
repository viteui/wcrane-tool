const { execSync } = require('child_process');
module.exports = {
    root: ".", // 项目根目录
    syncGit: true, // 是否同步到git
    // 发布版本号自动升级等级
    versionLevel: 'patch', // major | minor | patch
    customPublish: true, // 是否自定义发布
    // 发布前执行
    before(config) {
        // console.log(config)
        // execSync('npm publish')
    },
    // 发布后执行
    after(config) {
        // console.log(config)
    }
}