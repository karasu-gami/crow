import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  UserFlags,
  type UserFlagsBitField,
  type PresenceStatus,
  type ActivityType,
} from "discord.js";
import User from "../../models/User.js";
import { Guild } from "../../utils/Guild.js";

export default {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information about a user")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to get information about")
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const { client, user, guild, member } = interaction;

    const targetUser =
      interaction.options.getUser("target") || interaction.user;
    const targetMember = await guild?.members.fetch(targetUser);

    const targetProfile =
      (await User.findOne({ userId: targetUser.id })) ||
      new User({ userId: targetUser.id, username: targetUser.username });

    const targetFlags = targetUser.flags;

    const badges = targetFlags?.toArray() || [];
    const badgeEmojis: Partial<
      Record<keyof typeof UserFlagsBitField.Flags, string>
    > = {
      HypeSquadOnlineHouse1: Guild.emojis.hs_bravery,
      HypeSquadOnlineHouse2: Guild.emojis.hs_brilliance,
      HypeSquadOnlineHouse3: Guild.emojis.hs_balance,
      Hypesquad: Guild.emojis.hypesquad_badge,
    };
    const badgeList = badges.map((b) => badgeEmojis[b]);

    const hasNitro =
      targetUser.avatarURL({ size: 1024 })?.includes("animated=true") ||
      targetMember?.avatarURL({ size: 1024 })?.includes("animated=true") ||
      targetUser.banner ||
      targetMember?.banner;
    if (hasNitro) {
      badgeList.push(Guild.emojis.nitro_badge);
    }

    const statusEmojis: Record<Lowercase<PresenceStatus>, string> = {
      online: Guild.emojis.online_status,
      idle: Guild.emojis.idle_status,
      dnd: Guild.emojis.dnd_status,
      offline: Guild.emojis.off_status,
      invisible: Guild.emojis.off_status,
    };

    const rawStatus = ((targetMember?.presence?.status as PresenceStatus) ??
      "offline") as Lowercase<PresenceStatus> | "offline";

    const statusEmoji = statusEmojis[rawStatus] ?? Guild.emojis.off_status;

    const activity = targetMember?.presence?.activities?.[0];
    const activityTypes: Record<ActivityType, string> = {
      "0": "Playing",
      "1": "Streaming",
      "2": "Listening",
      "3": "Watching",
      "4": "",
      "5": "Competing",
    };
    const acitivityType = activity
      ? activityTypes[activity.type as ActivityType]
      : "";

    const embed = new EmbedBuilder()
      .setAuthor({
        name: user.username,
        iconURL: user.avatarURL({ size: 1024 })!,
      })
      .setThumbnail(
        targetMember?.avatarURL({ size: 1024 }) ||
          targetUser.avatarURL({ size: 1024 })
      )
      .setTitle(
        `${
          targetMember?.nickname ||
          targetMember?.displayName ||
          targetUser.username
        }'s Info`
      )
      .setDescription(
        `${statusEmoji} ${rawStatus} ${
          activity && `| ${acitivityType} \`${activity.name}\``
        }`
      )
      .addFields(
        {
          name: "Username",
          value: `\`@\`${targetUser.username}`,
          inline: true,
        },
        {
          name: "Mention",
          value: `${targetUser}`,
          inline: true,
        },
        { name: "ID", value: `\`${targetUser.id}\``, inline: true },
        {
          name: "Created",
          value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        { name: "\u200b", value: `\u200b`, inline: true },
        {
          name: "Joined",
          value: `<t:${Math.floor(targetMember?.joinedTimestamp! / 1000)}:R>`,
          inline: true,
        },
        { name: "Badges", value: `${badgeList.join(" ")}`, inline: false },
        {
          name: "Roles",
          value: `${targetMember?.roles.cache
            .filter((r) => r.name !== "@everyone")
            .map((r) => r)
            .join(", ")}`,
          inline: false,
        }
      )
      .setColor(targetUser.accentColor || "Orange")
      .setFooter({
        text: `${client.user.username} - ${this.data.name}`,
        iconURL: client.user.avatarURL({ size: 1024 })!,
      })
      .setTimestamp();

    targetProfile?.rank &&
      embed.addFields(
        { name: "EXP", value: `\`${targetProfile.rank.exp}\``, inline: true },
        { name: "\u200b", value: `\u200b`, inline: true },
        {
          name: "Level",
          value: `\`${targetProfile.rank.exp}\\${targetProfile.rank.levelUpExp}exp\``,
          inline: true,
        }
      );

    if (targetMember?.banner)
      embed.setImage(targetMember.bannerURL({ size: 1024 }) || null);
    if (targetUser?.banner)
      embed.setImage(targetUser.bannerURL({ size: 1024 }) || null);

    await interaction.reply({
      embeds: [embed],
      flags: [MessageFlags.Ephemeral],
    });
  },
};
