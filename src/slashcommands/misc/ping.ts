import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("replies crow latency"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const latency = reply.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply(
      `Pong! My latency is \`${latency}ms\` and the API latency is \`${Math.round(
        interaction.client.ws.ping
      )}ms\`.`
    );
  },
};
