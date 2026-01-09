import chalk from "chalk";
export const Logger = {
    log(message) {
        console.log(chalk.whiteBright("[LOG] ") +
            `${new Date().toLocaleTimeString()} - ` +
            message +
            `\n`);
    },
    module(message) {
        console.log(chalk.magentaBright("[MODULE] ") +
            `${new Date().toLocaleTimeString()} - ` +
            message);
    },
    success(message) {
        console.log(chalk.greenBright("[SUCCESS] ") +
            `${new Date().toLocaleTimeString()} - ` +
            message +
            `\n`);
    },
    error(message) {
        console.log(chalk.redBright("[ERROR] ") +
            `${new Date().toLocaleTimeString()} - ` +
            message +
            `\n`);
    },
    warn(message) {
        console.warn(chalk.yellowBright("[WARN] ") +
            `${new Date().toLocaleTimeString()} - ` +
            message +
            `\n`);
    },
    info(message) {
        console.info(chalk.blueBright("[INFO] ") +
            `${new Date().toLocaleTimeString()} - ` +
            message +
            `\n`);
    },
};
//# sourceMappingURL=Logger.js.map