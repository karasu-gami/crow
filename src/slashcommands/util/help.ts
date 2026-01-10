import {
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { CROW } from "../../structures/crow";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows a list of all available commands"),
  async execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client as CROW;
    const guild = interaction.guild!;

    const apiCommands = await guild.commands.fetch();

    // Agrupa comandos por categoria
    const categories: { [key: string]: string[] } = {};
    client.commands.forEach((cmd) => {
      const category = cmd.category || "Outros";
      if (!categories[category]) categories[category] = [];

      const apiCmd = apiCommands.find((c) => c.name === cmd.data.name);
      const cmdStr = apiCmd
        ? `</${cmd.data.name}:${apiCmd.id}>`
        : `\`${cmd.data.name}\``;

      categories[category].push(`${cmdStr} \`${cmd.data.description}\``);
    });

    // Cria embed com seções por categoria
    const embed = new EmbedBuilder()
      .setTitle("Commands per category")
      .setDescription("Use the clickable commands below!")
      .setColor("Purple")
      .setTimestamp()
      .setFooter({ text: `total: ${client.commands.size} commands` });

    Object.entries(categories).forEach(([category, commands]) => {
      embed.addFields({
        name: `${category}`,
        value: commands.join("\n") || "No commands",
        inline: false,
      });
    });

    await interaction.reply({
      embeds: [embed],
      flags: [MessageFlags.Ephemeral],
    });
  },
};
