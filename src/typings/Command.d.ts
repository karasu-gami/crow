import {
  SlashCommandBuilder,
  Command,
  type CommandInteractionInteraction,
} from "discord.js";
import type { CROW } from "../structures/crow";

export interface ICommand {
  data: SlashCommandBuilder;
  category: string;
  execute: (interaction: CommandInteraction, crow: CROW) => Promise<void>;
}
