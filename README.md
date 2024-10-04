# 脚手架集合

## 安装
```shell
npm i -g wcrane-tool
```

## pkg 指令

### pkg init
初始化配置
```shell
pkg init
```
### pkg publish
发布到npm & 同步到git

#### 支持自定义配置

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