const commander = require("commander")  // 命令注册
const publish = require("../utils/publish");
const program = new commander.Command()  // 创建命令注册实例
const commandOptions = program.opts()  // 获取command options
//  命令的注册
function registerCommand() {

    program
        .command('publish')
        .action(publish)

    //  对未知命令监听
    program.on("command:*", (comamndObj) => {
        const availabelCommands = program.commands.map(cmd => cmd.name());
        console.log(colors.red("未知命令: " + comamndObj[0]))
        if (availabelCommands.length > 0) {
            console.log(colors.green("可用命令: " + availabelCommands.join(",")))
        }
    })
    // 未输入指令提示
    if (program.args && program.args.length < 1) {
        program.outputHelp()
        console.log()
    }
    if (process.argv.length < 3) {
        program.outputHelp()
        console.log()
    }

    program.parse(process.argv)
}


async function core() {
    registerCommand()
}

module.exports = core