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
    const latency = Date.now() - interaction.createdTimestamp;

    await interaction.editReply(`Pong! Latency is ${latency}ms.`);
  },
};
