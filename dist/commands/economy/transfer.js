import { MessageFlags, SlashCommandBuilder, } from "discord.js";
import User from "../../models/User.js";
import { Logger } from "../../utils/Logger.js";
export default {
    data: new SlashCommandBuilder()
        .setName("transfer")
        .setDescription("Transfer coins to another user")
        .addNumberOption((option) => option
        .setName("amount")
        .setDescription("The amount of coins to transfer")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1000000))
        .addUserOption((option) => option
        .setName("recipient")
        .setDescription("The user to transfer coins to")
        .setRequired(true)),
    async execute(interaction) {
        const optionAmount = interaction.options.getNumber("amount");
        const optionRecipient = interaction.options.getUser("recipient");
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        const userProfile = (await User.findOne({ userId: interaction.user.id })) ||
            new User({
                userId: interaction.user.id,
                username: interaction.user.username,
                coins: 0,
            });
        const recipientProfile = (await User.findOne({ userId: optionRecipient.id })) ||
            new User({
                userId: optionRecipient.id,
                username: optionRecipient.username,
            });
        const userWallet = userProfile.economy?.wallet;
        if (userWallet < optionAmount) {
            return interaction.editReply(`You do not have enough coins to transfer ${optionAmount} coins. Your current balance is ${userWallet} coins.`);
        }
        else {
            try {
                userProfile.economy.wallet -= optionAmount;
                await userProfile.save();
                recipientProfile.economy.wallet += optionAmount;
                await recipientProfile.save();
                return interaction.editReply(`Successfully transferred ${optionAmount} coins to ${optionRecipient.username}. Your new balance is ${userProfile.economy.wallet} coins.`);
            }
            catch (error) {
                Logger.error(`Error transferring coins: ${error}`);
            }
        }
    },
};
//# sourceMappingURL=transfer.js.map