import { MessageFlags, SlashCommandBuilder, } from "discord.js";
export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("replies crow latency"),
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const reply = await interaction.fetchReply();
        const latency = reply.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply({
            content: `Pong! My latency is \`${latency}ms\` and the API latency is \`${Math.round(interaction.client.ws.ping)}ms\`.`,
        });
    },
};
//# sourceMappingURL=ping.js.map