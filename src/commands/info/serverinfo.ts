import {
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import { Guild } from "../../utils/Guild.js";

export default {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Show information about the current server"),
  async execute(interaction: ChatInputCommandInteraction) {
    const { client, guild, user } = interaction;

    const memberCount = guild?.memberCount ?? 0;
    const owner = await guild?.fetchOwner();
    const createdAt = guild?.createdTimestamp
      ? Math.floor(guild.createdTimestamp / 1000)
      : 0;
    const rolesCount = guild?.roles.cache.size ?? 0;
    const channelsCount = guild?.channels.cache.size ?? 0;
    const mostCommonRole = guild?.roles.cache
      .sort((a, b) => b.members.size - a.members.size)
      .first();
    const rulesChannel = await guild?.channels.fetch(Guild.channels.rules);
    const newestMember = guild?.members.cache
      .sort((a, b) => b.joinedTimestamp! - a.joinedTimestamp!)
      .first();

    const apps = guild?.members.cache.filter((m) => m.user.bot).size ?? 0;

    let verificationLevel = "Unknown";
    switch (guild?.verificationLevel) {
      case 0:
        verificationLevel = "None";
        break;
      case 1:
        verificationLevel = "Low";
        break;
      case 2:
        verificationLevel = "Medium";
        break;
      case 3:
        verificationLevel = "High";
        break;
      case 4:
        verificationLevel = "Very High";
        break;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL({ size: 64 }),
      })
      .setTitle(`${guild?.name}'s Info`)
      .setColor("Purple")
      .setDescription(
        `\`${guild?.description}\`` || "No description available."
      )
      .addFields(
        {
          name: "Owner",
          value: `${owner?.user || "Unknown member"}`,
          inline: true,
        },
        { name: "Members", value: `${memberCount} members`, inline: true },
        {
          name: "Newest Member",
          value: `${newestMember?.user || "Unknown member"}`,
          inline: true,
        },
        { name: "Roles", value: `${rolesCount} roles`, inline: true },
        {
          name: "Highest Role",
          value: `${guild?.roles.highest}`,
          inline: true,
        },
        {
          name: "Most Common Role",
          value: `${mostCommonRole || "None"}`,
          inline: true,
        },
        { name: "Boost Level", value: `${guild?.premiumTier}`, inline: true },
        {
          name: "Boosts",
          value: `${guild?.premiumSubscriptionCount || 0}`,
          inline: true,
        },
        { name: "Emojis", value: `${guild?.emojis.cache.size}`, inline: true },
        {
          name: "Verification Level",
          value: verificationLevel,
          inline: true,
        },
        {
          name: "Rules",
          value: `${rulesChannel}`,
          inline: true,
        },
        {
          name: "Created",
          value: `<t:${createdAt}:R>`,
          inline: true,
        },
        { name: "Channels", value: `${channelsCount}`, inline: true },
        {
          name: "Text Channels",
          value: `${
            guild?.channels.cache.filter((c) => c.isTextBased()).size
          } text chats`,
          inline: true,
        },
        {
          name: "Voice Channels",
          value: `${
            guild?.channels.cache.filter((c) => c.isVoiceBased()).size
          } voice chats`,
          inline: true,
        },
        {
          name: "Apps",
          value: `${apps} apps`,
          inline: true,
        },
        { name: "\u200B", value: "\u200B", inline: true },
        { name: "Crow", value: `${client.user}`, inline: true }
      )
      .setURL(Guild.invites.rules)
      .setFooter({
        text: `${client.user?.username} - ${this.data.name}`,
        iconURL: client.user.displayAvatarURL({
          size: 64,
        }),
      });
    if (guild?.iconURL()) {
      embed.setThumbnail(guild.iconURL({ size: 512 }));
    }

    if (guild?.bannerURL()) {
      embed.setImage(guild.bannerURL({ size: 1024 }));
    }

    await interaction.reply({
      embeds: [embed],
      flags: [MessageFlags.Ephemeral],
    });
  },
};
