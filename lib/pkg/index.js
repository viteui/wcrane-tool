const commander = require("commander")  // 命令注册
const publish = require("../../command/pkg/publish");
const init = require("../../command/pkg/init");
const program = new commander.Command()  // 创建命令注册实例
const commandOptions = program.opts()  // 获取command options
//  命令的注册
function registerCommand() {

    program
        .command('publish')
        .description('发布')
        .action(publish)

    program.command('init')
        .description('初始化配置')
        .action(init)
    //  对未知命令监听
    program.on("command:*", (comamndObj) => {
        const availabelCommands = program.commands.map(cmd => cmd.name());
        console.log(colors.red("未知命令: " + comamndObj[0]))
        if (availabelCommands.length > 0) {
            console.log(colors.green("可用命令: " + availabelCommands.join(",")))
        }
    })
    program.parse(process.argv)
}


async function core() {
    registerCommand()
}

module.exports = core