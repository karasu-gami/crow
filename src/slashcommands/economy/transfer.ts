import {
  MessageFlags,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import User from "../../models/User.js";
import { Logger } from "../../utils/Logger.js";

export default {
  data: new SlashCommandBuilder()
    .setName("transfer")
    .setDescription("Transfer coins to another user")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of coins to transfer")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1000000)
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to transfer coins to")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const optionAmount = interaction.options.getNumber("amount");
    const optionTarget = interaction.options.getUser("target");

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const userProfile =
      (await User.findOne({ userId: interaction.user.id })) ||
      new User({
        userId: interaction.user.id,
        username: interaction.user.username,
        coins: 0,
      });

    const targetProfile =
      (await User.findOne({ userId: optionTarget!.id })) ||
      new User({
        userId: optionTarget!.id,
        username: optionTarget!.username,
      });

    const userWallet = userProfile.economy?.wallet;

    if (userWallet! < optionAmount!) {
      return interaction.editReply(
        `You do not have enough coins to transfer ${optionAmount} coins. Your current balance is ${userWallet} coins.`
      );
    } else {
      try {
        userProfile.economy!.wallet -= optionAmount!;
        await userProfile.save();
        targetProfile.economy!.wallet += optionAmount!;
        await targetProfile.save();

        return interaction.editReply(
          `Successfully transferred ${optionAmount} coins to ${
            optionTarget!.username
          }. Your new balance is ${userProfile.economy!.wallet} coins.`
        );
      } catch (error) {
        Logger.error(`Error transferring coins: ${error}`);
      }
    }
  },
};
