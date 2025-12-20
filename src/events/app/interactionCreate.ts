import { Events, type CommandInteraction } from "discord.js";
import type { CROW } from "../../structures/crow";

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;

    const crow = interaction.client as CROW;

    const command = crow.commands.get(interaction.commandName);
    if (!command) {
      crow.logger.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction, crow);
    } catch (error) {
      crow.logger.error(`Error executing ${interaction.commandName}: ${error}`);

      if (interaction.replied || interaction.deferred) {
        await interaction
          .followUp({
            content: "An error occurred while executing this command.",
            ephemeral: true,
          })
          .catch(() => {});
      } else {
        await interaction
          .reply({
            content: "An error occurred while executing this command.",
            ephemeral: true,
          })
          .catch(() => {});
      }
    }
  },
};
