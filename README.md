# 脚手架集合

## pkg 指令

### pkg publish
发布到npm & 同步到git

#### 支持自定义配置

esm配置文件
```js
import { execSync } from 'child_process'
export default {
    root: ".", // 项目根目录
    syncGit: true, // 是否同步到git
    // 发布版本号自动升级等级
    versionLevel: 'patch', // major | minor | patch
    // 是否自定义发布
    customPublish: false, 
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
```

cjs模式的配置文件将导出修改为

```js
module.exports = {
    
}
```