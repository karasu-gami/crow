import dotenv from "dotenv";
import { CROW } from "./structures/crow.js";
import chalk from "chalk";

dotenv.config();

const client = new CROW();
(async () => {
  await client.initialize().catch((error) => {
    console.error(
      chalk.redBright("[ERROR] "),
      "Failed to initialize the bot:",
      error
    );
    process.exit(1);
  });
})().catch((error) => {
  console.error(
    chalk.redBright("[ERROR] "),
    "Unexpected error during bot initialization:",
    error
  );
  process.exit(1);
});
