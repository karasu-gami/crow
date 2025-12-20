import { SlashCommandBuilder, type CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("replies crow latency"),
  async execute(interaction: CommandInteraction) {
    await interaction.reply(
      `Pong! Latency is ${interaction.client.ws.ping}ms.`
    );
  },
};
