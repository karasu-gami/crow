import {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";

import path from "path";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";
import type { ICommand } from "../typings/Command";
import { Logger } from "../utils/Logger.js";
import chalk from "chalk";
import type { IEvent } from "../typings/Event";
import { Guild } from "../utils/Guild.js";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class CROW extends Client {
  commands: Collection<string, ICommand> = new Collection();
  public declare logger: typeof Logger;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
    });

    this.logger = Logger;
  }

  token =
    process.env.NODE_ENV === "production"
      ? process.env.CROW_TOKEN!
      : process.env.CROW_TEST_TOKEN!;

  client_id =
    process.env.NODE_ENV === "production"
      ? process.env.CLIENT_ID!
      : process.env.CLIENT_TEST_ID!;

  async loadCommands(commandPath: string): Promise<void> {
    try {
      let commandCount = 0;
      const categories = readdirSync(commandPath);
      for (const category of categories) {
        const commandFiles = readdirSync(
          path.join(commandPath, category)
        ).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
        for (const file of commandFiles) {
          const filePath = path.join(commandPath, category, file);
          const commandImport = await import(`file://${filePath}`);
          const command: ICommand = commandImport.default;

          if (command) {
            command.category = category;
            this.commands.set(command.data.name, command);
            commandCount++;
            this.logger.module(
              `Loaded command: ${chalk.yellowBright(command.data.name)}`
            );
          } else {
            this.logger.warn(`Failed to load command at ${filePath}`);
          }
        }
      }

      this.logger.info(chalk.cyanBright(`${commandCount} command(s) loaded`));
    } catch (error) {
      this.logger.error(`Failed to load commands: ${error}`);
    }
  }

  async loadEvents(eventPath: string): Promise<void> {
    try {
      let eventCount = 0;
      const categories = readdirSync(eventPath);
      for (const category of categories) {
        const categoriesPath = path.join(eventPath, category);
        const eventFiles = readdirSync(categoriesPath).filter(
          (file) => file.endsWith(".ts") || file.endsWith(".js")
        );

        for (const file of eventFiles) {
          const filePath = path.join(categoriesPath, file);
          const eventImport = await import(`file://${filePath}`);
          const event: IEvent = eventImport.default;

          if (event && event.name) {
            if (event.once) {
              this.once(event.name, (...args) => event.execute(...args));
            } else {
              this.on(event.name, (...args) => event.execute(...args));
            }
            eventCount++;
            this.logger.module(
              `Loaded event: ${chalk.yellowBright(
                event.name
              )} - ${chalk.magentaBright(
                file
              )} from category: ${chalk.blueBright(category)}`
            );
          } else {
            this.logger.warn(
              `Failed to load event at ${filePath} - Missing ${chalk.yellowBright(
                "'name'"
              )} property`
            );
          }
        }
      }
      this.logger.info(chalk.greenBright(`${eventCount} event(s) loaded`));
    } catch (error) {
      this.logger.error(`Failed to load events: ${error}`);
    }
  }

  async registerSlashCommands(): Promise<void> {
    try {
      const commands = Array.from(this.commands.values()).map((cmd) =>
        cmd.data.toJSON()
      );

      const rest = new REST().setToken(this.token);

      this.logger.log("Registering slash commands...");

      const data = await rest.put(
        Routes.applicationGuildCommands(this.client_id, Guild.ID),
        { body: commands }
      );

      this.logger.success(
        `Successfully registered ${chalk.cyanBright(
          (data as any[]).length + " slash command(s)"
        )}`
      );
    } catch (error) {
      this.logger.error(`Failed to register slash commands: ${error}`);
    }
  }

  async connectDB(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGOOSE_URI!);

      this.logger.success(
        `Connected to the ${chalk.yellowBright(
          mongoose.connection.name
        )} database successfully`
      );
    } catch (error) {
      this.logger.error(`Database connection failed: ${error}`);
    }
  }

  async initialize(): Promise<void> {
    try {
      const commandPath = path.join(__dirname, "..", "commands");
      const eventPath = path.join(__dirname, "..", "events");

      this.logger.log(`${chalk.magentaBright("crow APP")} is starting...`);

      await this.loadCommands(commandPath);
      await this.loadEvents(eventPath);
      await this.registerSlashCommands();

      await this.connectDB();

      await this.login(this.token).then(() =>
        this.logger.success(`${chalk.magenta("crow APP")} started successfully`)
      );
    } catch (error) {
      this.logger.error(`Initialization failed: ${error}`);
      process.exit(1);
    }
  }
}
