import { EmbedBuilder, MessageFlags, SlashCommandBuilder, } from "discord.js";
export default {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Show target`s avatar")
        .addUserOption((option) => option
        .setName("target")
        .setDescription("The user to show the avatar of")
        .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getUser("target") ?? interaction.user;
        const avatarEmbed = new EmbedBuilder()
            .setAuthor({
            name: interaction.client.user.username,
            iconURL: interaction.client.user.displayAvatarURL({ size: 1024 }),
        })
            .setTitle(`${target.username}'s Avatar`)
            .setImage(target.displayAvatarURL({ size: 1024 }))
            .setColor(target.accentColor ?? "Purple")
            .setFooter({
            text: `${target.username} - ${this.data.name}`,
            iconURL: interaction.client.user.displayAvatarURL({ size: 1024 }),
        });
        await interaction.reply({
            embeds: [avatarEmbed],
            flags: [MessageFlags.Ephemeral],
        });
    },
};
//# sourceMappingURL=avatar.js.map