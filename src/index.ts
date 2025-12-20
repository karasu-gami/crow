import dotenv from "dotenv";
import { CROW } from "./structures/crow.js";
import chalk from "chalk";

import express from "express";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 10000;

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

app.get("/", (_req, res) => {
  res.status(200).send("crow bot is running");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    chalk.greenBright("[INFO] "),
    `HTTP server is running on port ${PORT}`
  );
});
