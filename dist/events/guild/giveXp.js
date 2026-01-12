import { Events } from "discord.js";
import User from "../../models/User.js";
import { addXpOnMessage } from "../../utils/Rank.js";
import { Logger } from "../../utils/Logger.js";
export default {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        const { author, content, createdTimestamp } = message;
        if (author.bot || !content || content.length < 3)
            return;
        try {
            let authorProfile = await User.findOne({ userId: author.id });
            if (!authorProfile) {
                authorProfile = new User({
                    userId: author.id,
                    username: author.username,
                });
                await authorProfile.save();
            }
            authorProfile.messages.push({
                content: content.slice(0, 100),
                message_id: parseInt(message.id),
                timestamp: Math.floor(createdTimestamp / 1000),
            });
            await addXpOnMessage(message);
            await authorProfile.save();
        }
        catch (error) {
            Logger.error(`${error}`);
        }
    },
};
//# sourceMappingURL=giveXp.js.map