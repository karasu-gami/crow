import {
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  Message,
  MessageFlags,
} from "discord.js";

export default {
  data: new ContextMenuCommandBuilder()
    .setName("User Info")
    .setType(ApplicationCommandType.User),
  async execute(interaction: ContextMenuCommandInteraction) {
    const userId = interaction.targetId;
    const user = await interaction.client.users.fetch(userId);

    await interaction.reply({
      content: `${user}`,
      flags: [MessageFlags.Ephemeral],
    });
  },
};
