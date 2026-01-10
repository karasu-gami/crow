import { Events } from "discord.js";
import User from "../../models/User.js";
export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        await User.updateMany({ economy: { $exists: false } }, { $set: { economy: { wallet: 500 } } });
        await User.updateMany({ rank: { $exists: false } }, {
            $set: {
                rank: {
                    exp: 0,
                    level: 1,
                    levelUpExp: 100,
                },
            },
        });
        client.logger.info("User schema synchronized to all users.");
    },
};
//# sourceMappingURL=syncSchemaToUsers.js.map