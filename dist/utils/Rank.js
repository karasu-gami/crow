import User from "../models/User.js";
import { EmbedBuilder } from "discord.js";
export async function addXpOnMessage(message, xpAmount = 15) {
    if (message.author.bot || !message.guild)
        return false;
    let profile = await User.findOne({ userId: message.author.id });
    const { channel } = message;
    if (!profile) {
        profile = new User({
            userId: message.author.id,
            username: message.author.username,
        });
        await profile.save();
    }
    if (profile.rank) {
        const oldLevel = profile.rank.level;
        profile.rank.exp += xpAmount;
        while (profile.rank.exp >= profile.rank.levelUpExp) {
            await levelUp(profile);
            profile.rank.exp = 0;
        }
        await profile.save();
        if (profile.rank.level > oldLevel) {
            const embed = new EmbedBuilder()
                .setTitle("🎉 LEVEL UP!")
                .setDescription(`**${message.author.username}** subiu para **Nível ${profile.rank.level}**!`)
                .addFields({ name: "💰 EXP Ganho", value: `+${xpAmount} XP`, inline: true }, {
                name: "📊 Próximo Nível",
                value: `${profile.rank.exp}/${profile.rank.levelUpExp} XP`,
                inline: true,
            })
                .setColor(profile.rank.level >= 50 ? 0xffd700 : 0x00ff00)
                .setThumbnail(message.author.avatarURL({ size: 256 }))
                .setFooter({ text: `Servidor: ${message.guild?.name}` });
            channel.isSendable() && (await channel.send({ embeds: [embed] }));
        }
        return profile.rank.level > oldLevel;
    }
    else {
        return false;
    }
}
async function levelUp(profile) {
    profile.rank.level += 1;
    profile.rank.levelUpExp = Math.floor(profile.rank.levelUpExp * 1.75);
    profile.rank.exp = 0;
}
//# sourceMappingURL=Rank.js.map