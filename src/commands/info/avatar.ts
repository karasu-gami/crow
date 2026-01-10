import {
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Show target member's guild avatar or user's global avatar")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user/member to show the avatar of")
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const { client, guild } = interaction;

    const target = interaction.options.getUser("target") ?? interaction.user;

    const member = guild?.members.cache.get(target.id);

    const avatarUrl =
      member?.avatarURL({ size: 4096, extension: "png" }) ??
      target.displayAvatarURL({ size: 4096, extension: "png" });

    const name = member ? member.displayName : target.username;

    const embed = new EmbedBuilder()
      .setTitle(member ? `${name}'s Guild Avatar` : `${name}'s Avatar`)
      .setImage(avatarUrl)
      .setColor(member?.displayColor || target.accentColor || "Purple")
      .setFooter({
        text: `${client.user?.username} - ${this.data.name}`,
        iconURL: client.user.displayAvatarURL({
          size: 64,
        }),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      flags: [MessageFlags.Ephemeral],
    });
  },
};
