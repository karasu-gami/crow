import { SlashCommandBuilder, EmbedBuilder, MessageFlags, UserFlags, } from "discord.js";
import User from "../../models/User.js";
import { Guild } from "../../utils/Guild.js";
export default {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Get information about a user")
        .addUserOption((option) => option
        .setName("target")
        .setDescription("The user to get information about")
        .setRequired(false)),
    async execute(interaction) {
        const { client, user, guild, member } = interaction;
        const targetUser = interaction.options.getUser("target") || interaction.user;
        const targetMember = await guild?.members.fetch(targetUser);
        const userProfile = (await User.findOne({ userId: targetUser.id })) ||
            new User({ userId: targetUser.id, username: targetUser.username });
        const targetFlags = targetUser.flags;
        const badges = [];
        if (targetFlags && targetFlags.has(UserFlags.HypeSquadOnlineHouse1))
            badges.push(Guild.emojis.hs_bravery);
        if (targetFlags && targetFlags.has(UserFlags.HypeSquadOnlineHouse2))
            badges.push(Guild.emojis.hs_brilliance);
        if (targetFlags && targetFlags.has(UserFlags.HypeSquadOnlineHouse3))
            badges.push(Guild.emojis.hs_balance);
        if (targetFlags && targetFlags.has(UserFlags.Hypesquad))
            badges.push(Guild.emojis.hypesquad_badge);
        if (targetUser.avatarURL()?.endsWith(".gif") || targetUser.banner)
            badges.push(Guild.emojis.nitro_badge);
        const embed = new EmbedBuilder()
            .setAuthor({
            name: user.username,
            iconURL: user.avatarURL({ size: 1024 }),
        })
            .setThumbnail(targetMember?.avatarURL({ size: 1024 }) ||
            targetUser.avatarURL({ size: 1024 }))
            .setTitle(`${targetMember?.nickname ||
            targetMember?.displayName ||
            targetUser.username}'s Info`)
            .addFields({
            name: "Username",
            value: `\`@\`${targetUser.username}`,
            inline: true,
        }, {
            name: "Mention",
            value: `${targetUser}`,
            inline: true,
        }, { name: "ID", value: `\`${targetUser.id}\``, inline: true }, {
            name: "Created",
            value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`,
            inline: true,
        }, { name: "\u200b", value: `\u200b`, inline: true }, {
            name: "Joined",
            value: `<t:${Math.floor(targetMember?.joinedTimestamp / 1000)}:R>`,
            inline: true,
        }, { name: "Badges", value: `${badges.join(" ")}`, inline: false }, {
            name: "Roles",
            value: `${targetMember?.roles.cache
                .filter((r) => r.name !== "@everyone")
                .map((r) => r)
                .join(", ")}`,
            inline: false,
        })
            .setColor(targetUser.accentColor || "Orange")
            .setFooter({
            text: `${client.user.username} - ${this.data.name}`,
            iconURL: client.user.avatarURL({ size: 1024 }),
        })
            .setTimestamp();
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
//# sourceMappingURL=userinfo.js.map