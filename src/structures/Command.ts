import { SlashCommandBuilder, type CommandInteraction } from "discord.js";
import { ICommand } from "../typings/Command";
import type { CROW } from "./crow";

export abstract class Command implements ICommand {
  data: SlashCommandBuilder;
  abstract execute(interaction: CommandInteraction, crow: CROW): Promise<void>;

  constructor(data: SlashCommandBuilder) {
    this.data = data;
  }
}
