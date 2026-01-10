import { MessageFlags, SlashCommandBuilder, } from "discord.js";
import User from "../../models/User.js";
export default {
    data: new SlashCommandBuilder()
        .setName("wallet")
        .setDescription("View your wallet"),
    async execute(interaction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        const userProfile = (await User.findOne({ userId: interaction.user.id })) ||
            new User({
                userId: interaction.user.id,
                username: interaction.user.username,
            });
        const wallet = userProfile?.economy?.wallet;
        await interaction.editReply(`💰 | You have **${wallet?.toLocaleString()}** coins in your wallet.`);
    },
};
//# sourceMappingURL=wallet.js.map