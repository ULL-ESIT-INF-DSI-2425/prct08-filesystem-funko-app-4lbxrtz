#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { UserManager } from "./userManager.js";
import { Funko } from "./funko.js";
import chalk from "chalk";
import { FunkoGenre, FunkoType } from "./enums.js";

const userManager = new UserManager();

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
yargs(hideBin(process.argv))
  .command(
    "add",
    "Adds a new Funko to a user collection",
    {
      user: {
        description: "User name",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "Funko ID",
        type: "string",
        demandOption: true,
      },
      name: {
        description: "Funko name",
        type: "string",
        demandOption: true,
      },
      desc: {
        description: "Funko description",
        type: "string",
        demandOption: true,
      },
      type: {
        description: "Funko type",
        type: "string",
        choices: Object.values(FunkoType),
        demandOption: true,
      },
      genre: {
        description: "Funko genre",
        type: "string",
        choices: Object.values(FunkoGenre),
        demandOption: true,
      },
      franchise: {
        description: "Funko franchise",
        type: "string",
        demandOption: true,
      },
      number: {
        description: "Funko number in franchise",
        type: "number",
        demandOption: true,
      },
      exclusive: {
        description: "Is Funko exclusive",
        type: "boolean",
        demandOption: true,
      },
      special: {
        description: "Special features",
        type: "string",
        demandOption: true,
      },
      value: {
        description: "Market value",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      const funko: Funko = {
        id: argv.id,
        name: argv.name,
        description: argv.desc,
        type: argv.type as FunkoType,
        genre: argv.genre as FunkoGenre,
        franchise: argv.franchise,
        number: argv.number,
        exclusive: argv.exclusive,
        specialFeatures: argv.special,
        marketValue: argv.value,
      };

      userManager.addFunkoToUser(argv.user, funko, (success) => {
        if (success) {
          console.log(
            chalk.green(
              `New Funko ${argv.name} added successfully to ${argv.user} collection!`,
            ),
          );
        } else {
          console.log(
            chalk.red(
              `This funko (${argv.id}) already exists at ${argv.user} collection!`,
            ),
          );
        }
      });
    },
  )
  .command(
    "update",
    "Updates a Funko in a user collection",
    {
      user: {
        description: "User name",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "Funko ID",
        type: "string",
        demandOption: true,
      },
      name: {
        description: "Funko name",
        type: "string",
        demandOption: true,
      },
      desc: {
        description: "Funko description",
        type: "string",
        demandOption: true,
      },
      type: {
        description: "Funko type",
        type: "string",
        choices: Object.values(FunkoType),
        demandOption: true,
      },
      genre: {
        description: "Funko genre",
        type: "string",
        choices: Object.values(FunkoGenre),
        demandOption: true,
      },
      franchise: {
        description: "Funko franchise",
        type: "string",
        demandOption: true,
      },
      number: {
        description: "Funko number in franchise",
        type: "number",
        demandOption: true,
      },
      exclusive: {
        description: "Is Funko exclusive",
        type: "boolean",
        demandOption: true,
      },
      special: {
        description: "Special features",
        type: "string",
        demandOption: true,
      },
      value: {
        description: "Market value",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      const funko: Funko = {
        id: argv.id,
        name: argv.name,
        description: argv.desc,
        type: argv.type as FunkoType,
        genre: argv.genre as FunkoGenre,
        franchise: argv.franchise,
        number: argv.number,
        exclusive: argv.exclusive,
        specialFeatures: argv.special,
        marketValue: argv.value,
      };

      userManager.updateFunkoInUser(argv.user, funko, (success) => {
        if (success) {
          console.log(chalk.green(`Funko updated at ${argv.user} collection!`));
        } else {
          console.log(
            chalk.red(
              `Funko with ${argv.id} ID not found at ${argv.user} collection!`,
            ),
          );
        }
      });
    },
  )
  .command(
    "remove",
    "Removes a Funko from a user collection",
    {
      user: {
        description: "User name",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "Funko ID",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      userManager.removeFunkoFromUser(argv.user, argv.id, (success) => {
        if (success) {
          console.log(
            chalk.green(`Funko removed from ${argv.user} collection!`),
          );
        } else {
          console.log(
            chalk.red(
              `Funko with ${argv.id} ID not found at ${argv.user} collection!`,
            ),
          );
        }
      });
    },
  )
  .command(
    "list",
    "Lists all Funkos in a user collection",
    {
      user: {
        description: "User name",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      userManager.listUserFunkos(argv.user, (hasFunkos) => {
        if (!hasFunkos) {
          console.log(
            chalk.yellow(`${argv.user} has no funkos in their collection`),
          );
        }
      });
    },
  )
  .command(
    "read",
    "Shows a specific Funko from a user collection",
    {
      user: {
        description: "User name",
        type: "string",
        demandOption: true,
      },
      id: {
        description: "Funko ID",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      userManager.getFunkoFromUser(argv.user, argv.id, (exists) => {
        if (!exists) {
          console.log(chalk.red(`Funko not found at ${argv.user} collection!`));
        }
      });
    },
  )
  .help().argv;
