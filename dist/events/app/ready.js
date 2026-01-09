import { Events } from "discord.js";
import chalk from "chalk";
export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        client.user &&
            client.logger.info(`Logged in as ${chalk.magentaBright(client.user.username)}`);
    },
};
//# sourceMappingURL=ready.js.map