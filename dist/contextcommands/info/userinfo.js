import { ApplicationCommandType, ContextMenuCommandBuilder, MessageFlags, } from "discord.js";
export default {
    data: new ContextMenuCommandBuilder()
        .setName("User Info")
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const userId = interaction.targetId;
        const user = await interaction.client.users.fetch(userId);
        await interaction.reply({
            content: `${user}`,
            flags: [MessageFlags.Ephemeral],
        });
    },
};
//# sourceMappingURL=userinfo.js.map