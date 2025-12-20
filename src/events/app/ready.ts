import { Events } from "discord.js";
import type { CROW } from "../../structures/crow";
import chalk from "chalk";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: CROW) {
    client.user &&
      client.logger.info(
        `Logged in as ${chalk.magentaBright(client.user.username)}`
      );
  },
};
