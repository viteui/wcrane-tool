# 脚手架集合

## 安装
1. 全局安装
```shell
npm i -g wcrane-tool
```
2. 局部安装
```shell
npm i -D wcrane-tool
```

## 使用

### pkg 

#### 介绍
该指令用于发布npm包，并同步到git仓库中

特点：
- 支持自定义配置
- 支持自定义发布
- 支持自定义git tag
- 支持自定义版本号
- 支持自定义发布前、发布后操作
- 支持自定义发布目录
- 支持自定义git仓库根目录
- 支持自定义git tag格式
- 支持自定义版本号等级

####  init
初始化配置，生成配置文件
- 使用
```shell
pkg init
```
#### publish
发布到npm & 同步到git

- 使用：
```shell
pkg publish
```
##### 支持自定义配置

esm配置文件
```js
import { execSync } from 'child_process'
export default{
    // 发布目录
    root: ".",
    // git 仓库根目录, 不填写则跟root一致
    gitRoot: '.',
    // 是否同步git
    syncGit: true,
    // 是否同步git tag
    syncGitTag: true,
    // 升级版本号的等级
    versionLevel: 'patch', // major | minor | patch
    // 自定义发布
    customPublish: false,
    
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
```

cjs模式的配置文件将导出修改为

```js
module.exports = {
    
}
```

### 实践案例
发布 [tinypng-lib-wasm](https://github.com/viteui/tinypng-lib-wasm/tree/master) wasm 的包
1. 项目发布前 构建wasm包，构建完成之后同步 README.md中的说明到 tinypng-lib-wasm npm包中
2. 构建后修改Cargo.toml中的版本号
3. 发布到npm & 同步到git & 打tag（release/v1.0.0）
```js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
module.exports = {
    // 发布目录
    root: "./pkg",
    // 是否同步git
    syncGit: true,
    // 是否同步git tag
    syncGitTag: true,
    // 升级版本号的等级
    versionLevel: 'patch', // major | minor | patch
    // 自定义发布
    customPublish: false,
    // git 仓库根目录
    gitRoot: '.',
    // 发布前执行
    before(config) {
        // 构建wasm 
        execSync('npm run build'); // 或者使用 wasm-pack build --target bundler
        // 拷贝当前目录下的 README 到 ./pkg下
        const pkgDir = path.resolve(__dirname, 'pkg');
        const pkgReadmePath = path.resolve(pkgDir, 'README.md');

        if (!fs.existsSync(pkgDir)) {
            fs.mkdirSync(pkgDir);
        }
        fs.copyFileSync(path.resolve(__dirname, 'README.md'), pkgReadmePath);
    },
    // 发布后执行
    after(config) {
        // 修改Cargo.toml 中的版本号
        const pkgDir = path.resolve(__dirname, '.');
        const pkgTomlPath = path.resolve(pkgDir, 'Cargo.toml');
        const pkgToml = fs.readFileSync(pkgTomlPath, 'utf-8');
        const newPkgToml = pkgToml.replace(/version = ".*?"/, `version = "${config.version}"`);
        fs.writeFileSync(pkgTomlPath, newPkgToml, 'utf-8');
    },
    // git tag 格式
    gitTagFormat: (version) => {
        return `release/v${version}`
    },
}

```