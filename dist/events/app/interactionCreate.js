import { Events, MessageFlags } from "discord.js";
import User from "../../models/User.js";
import { Logger } from "../../utils/Logger.js";
const handled = new Set();
export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isCommand())
            return;
        try {
            const userProfile = (await User.findOne({ userId: interaction.user.id })) ||
                new User({
                    userId: interaction.user.id,
                    username: interaction.user.username,
                });
            await userProfile.save();
        }
        catch (error) {
            Logger.error(`Error fetching or creating user profile: ${error}`);
            return;
        }
        if (handled.has(interaction.id)) {
            return;
        }
        handled.add(interaction.id);
        const crow = interaction.client;
        const command = crow.commands.get(interaction.commandName);
        if (!command) {
            crow.logger.error(`No command matching ${interaction.commandName} was found.`);
            if (!interaction.replied && !interaction.deferred) {
                await interaction
                    .reply({
                    content: "The interaction did not respond, try again later!",
                    flags: [MessageFlags.Ephemeral],
                })
                    .catch(() => { });
            }
            setTimeout(() => handled.delete(interaction.id), 60000);
            return;
        }
        // Common error handling function
        const sendError = async () => {
            if (!interaction.isRepliable())
                return;
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: "An error occurred while executing this command.",
                        flags: [MessageFlags.Ephemeral],
                    });
                }
                else {
                    await interaction.reply({
                        content: "An error occurred while executing this command.",
                        flags: [MessageFlags.Ephemeral],
                    });
                }
            }
            catch { }
        };
        const executeCommand = async () => {
            await command.execute(interaction, crow);
        };
        try {
            if (interaction.isChatInputCommand() ||
                interaction.isContextMenuCommand()) {
                await executeCommand();
            }
        }
        catch (error) {
            crow.logger.error(`Error executing ${interaction.commandName}: ${error}`);
            if (error.code === 10062 || error.code === 40060)
                return;
            await sendError();
        }
        finally {
            setTimeout(() => handled.delete(interaction.id), 60000);
        }
    },
};
//# sourceMappingURL=interactionCreate.js.map