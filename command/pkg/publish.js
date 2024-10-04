const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { spinnerStart } = require('../../utils');
const log = require('../../utils/log');
// 版本号等级对应数组项
const versionLevelMap = {
    major: 0,
    minor: 1,
    patch: 2
}

const defaultPublishConfig = {
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
    // git root目录
    gitRoot: '.',
    // 发布前执行
    before() {
        // console.log(config)
    },
    // 发布后执行
    after() {
        // console.log(config)
    },
    // git tag 格式
    gitTagFormat: (version) => {
        return `v${version}`
    },
}

async function loadPublishConfig(publishConfigPath, pkgJson) {
    if (fs.existsSync(publishConfigPath)) {
        // Check if the environment supports 'require' (CommonJS)
        try {
            // 如果类型为commonjs相关的使用require 
            if (typeof require !== 'undefined' && pkgJson.type !== 'module') {
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
    // console.log('Publishing....');
    const npmSpinner = spinnerStart("npm publishing ...")

    // 获取当前终端指令的目录
    const cwdPath = process.cwd();
    const publishConfigPath = path.resolve(cwdPath, './publish.config.js');

    let config = defaultPublishConfig;
    if (fs.existsSync(publishConfigPath)) {
        // 获取当前目录下的package.json  的type字段，如果是module，则使用esm
        const pkgJson = JSON.parse(fs.readFileSync(path.resolve(cwdPath, './package.json')));

        // 读取配置js 文件
        const publishConfig = await loadPublishConfig(publishConfigPath, pkgJson || {});
        if (publishConfig) {
            config = {
                ...config,
                // 删除为"", undefined, null 的属性
                ...Object.fromEntries(Object.entries(publishConfig).filter(([key, value]) => value !== "" && value !== undefined && value !== null))
            };
        }
    }
    const rootDir = config.root || ".";
    const pkgDir = path.resolve(cwdPath, rootDir);
    log.info('root dir', pkgDir);
    // 执行前钩子
    if (config.before && typeof config.before === 'function') {
        await config.before({
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

    process.chdir(pkgDir);
    // 打包 流输出日志
    if (!config.customPublish) {

        //需要到相应的 pkgDir 目录下执行 execSync
        execSync('npm publish');
        npmSpinner.stop();
        log.success('npm publish success');
    } else {
        npmSpinner.stop();
    }

    const gitDir = path.resolve(cwdPath, config.gitRoot || config.root || ".");
    log.info('git root dir', gitDir);
    process.chdir(gitDir);
    // 检查git 状态 是否有变更
    const gitStatus = execSync('git status').toString().trim();
    if (gitStatus.includes('Changes to be committed'
        || gitStatus.includes('Untracked files')
        || gitStatus.includes('nothing to commit, working tree clean')
    )) {
        console.warn('git status', gitStatus);
    } else {
        if (config.syncGit) {
            const syncGitSpinner = spinnerStart("git syncing ...")
            // 同步git
            execSync('git add .');
            execSync('git commit -m "publish version ' + pkgJson.version + '"');
            execSync('git push');
            syncGitSpinner.stop();
            log.success('git sync success');
        }
        if (config.syncGitTag) {
            const syncGitTagSpinner = spinnerStart("git tag syncing ... \n")
            let tag = `v${pkgJson.version}`
            if (config.gitTagFormat && typeof config.gitTagFormat === 'function') {
                tag = config.gitTagFormat(pkgJson.version);
            }
            process.chdir(pkgDir);
            // 每一次发布打一个tag
            execSync('git tag ' + tag);
            execSync('git push origin ' + tag);
            syncGitTagSpinner.stop();
            log.success('git tag sync success');
        }
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

}

module.exports = publish;