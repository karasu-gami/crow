import chalk from "chalk";

export const Logger = {
  log(message: string): void {
    console.log(
      chalk.whiteBright("[LOG] ") +
        `${new Date().toLocaleTimeString()} - ` +
        message +
        `\n`
    );
  },

  module(message: string): void {
    console.log(
      chalk.magentaBright("[MODULE] ") +
        `${new Date().toLocaleTimeString()} - ` +
        message
    );
  },

  success(message: string): void {
    console.log(
      chalk.greenBright("[SUCCESS] ") +
        `${new Date().toLocaleTimeString()} - ` +
        message +
        `\n`
    );
  },

  error(message: string): void {
    console.log(
      chalk.redBright("[ERROR] ") +
        `${new Date().toLocaleTimeString()} - ` +
        message +
        `\n`
    );
  },

  warn(message: string): void {
    console.warn(
      chalk.yellowBright("[WARN] ") +
        `${new Date().toLocaleTimeString()} - ` +
        message +
        `\n`
    );
  },

  info(message: string): void {
    console.info(
      chalk.blueBright("[INFO] ") +
        `${new Date().toLocaleTimeString()} - ` +
        message +
        `\n`
    );
  },
};
