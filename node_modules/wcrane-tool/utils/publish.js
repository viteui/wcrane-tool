const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 版本号等级对应数组项
const versionLevelMap = {
    major: 0,
    minor: 1,
    patch: 2
}

const defaultPublishConfig = {
    root: ".",
    syncGit: true,
    // 升级版本号的等级
    versionLevel: 'patch',
    customPublish: false, // 自定义发布
    // 发布前执行
    before() {

    },
    // 发布后执行
    after() {

    }
}

async function loadPublishConfig(publishConfigPath) {
    if (fs.existsSync(publishConfigPath)) {
        // Check if the environment supports 'require' (CommonJS)
        try {
            if (typeof require !== 'undefined') {
                return require(publishConfigPath);
            }
        } catch (error) {
            // Otherwise, use dynamic import for ES modules
            const publishConfig = await import(publishConfigPath);
            return publishConfig.default || publishConfig;
        }

    }
    return defaultPublishConfig;
}
async function publish() {
    console.log('Publishing....');

    // 获取当前终端指令的目录
    const cwdPath = process.cwd();
    const publishConfigPath = path.resolve(cwdPath, './publish.config.js');
    let config = defaultPublishConfig;
    if (fs.existsSync(publishConfigPath)) {
        // 读取配置js 文件
        const publishConfig = await loadPublishConfig(publishConfigPath);
        if (publishConfig) {
            config = {
                ...config,
                // 删除为"", undefined, null 的属性
                ...Object.fromEntries(Object.entries(publishConfig).filter(([key, value]) => value !== "" && value !== undefined && value !== null))
            };
        }
    }
    const pkgDir = path.resolve(cwdPath, config.root || '.');
    // 执行前钩子
    if (config.before && typeof config.before === 'function') {
        config.before({
            cwdPath,
            pkgDir,
            ...config
        });
    }
    // 获取publish 配置文件

    // 升级./pkg下 package.json的版本号最后一位+1
    const pkgJsonPath = path.resolve(pkgDir, 'package.json');
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath));
    if (!pkgJson.version) {
        throw new Error('package.json 中没有 version 字段');
    }
    const versions = pkgJson.version.split(".");
    const versionLevel = versionLevelMap[config.versionLevel]
    let lastVersion = parseInt(versions[versionLevel]);
    if (versions.length !== 3) {
        throw new Error('package.json 中 version 字段格式不正确');
    }
    if (!lastVersion && lastVersion !== 0) {
        throw new Error('package.json 中 version 字段格式不正确');
    }
    if (isNaN(lastVersion)) {
        throw new Error('package.json 中 version 字段格式不正确');
    }

    lastVersion += 1;
    versions[versionLevel] = lastVersion.toString();
    pkgJson.version = versions.join(".");
    // 新版本
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

    // 打包 流输出日志
    if (!config.customPublish) {
        execSync('npm publish');
    }

    if (config.syncGit) {
        // 同步git
        execSync('git add .');
        execSync('git commit -m "publish version ' + pkgJson.version + '"');
        execSync('git push');
    }
    if (config.after && typeof config.after === 'function') {
        config.after({
            cwdPath,
            pkgDir,
            ...config,
            version: pkgJson.version,
            packageJson: pkgJson
        });
    }
    console.log('Publish success');

}

module.exports = publish;