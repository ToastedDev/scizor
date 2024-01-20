#!/usr/bin/env node

import chalk from "chalk";
import {
  promptForDirectory,
  promptForGit,
  promptForInstall,
  promptForProjectType,
} from "./prompts.js";
import { createProject } from "./utils/project/index.js";
import { Command, Option } from "commander";
import { getVersion } from "./utils/version.js";
import { parseNameAndPath } from "./utils/parse-path.js";
import { logNextSteps } from "./utils/project/next-steps.js";

const cli = async () => {
  const program = new Command()
    .name("create-scizor")
    .description("A CLI for creating backend applications with scizor")
    .argument("[directory]", "Where the project will be created")
    .addOption(
      new Option(
        "-l, --language <language>",
        "The language to use for the project",
      ).choices(["javascript", "typescript", "js", "ts"]),
    )
    .option(
      "--skip-install",
      "Don't run a package manager install after creating the project",
    )
    .option("--skip-git", "Don't initialize git after creating the project")
    .version(getVersion(), "-v, --version", "Display the current version")
    .parse(process.argv);
  const options = program.opts();

  console.log(chalk.bold.bgRed.black(" create-scizor "));
  console.log();

  const cliProvidedDirectory = program.args[0];
  const directory = await promptForDirectory({
    directory: cliProvidedDirectory,
  });
  const [name, path] = parseNameAndPath(directory);

  const projectType = await promptForProjectType({
    providedProjectType: options.language,
  });
  const initializeGit = await promptForGit({
    skipGit: options.skipGit,
  });
  const installPackages = await promptForInstall({
    skipInstall: options.skipInstall,
  });

  if (!cliProvidedDirectory && !options.skipGit && !options.skipInstall)
    console.log();

  await createProject({
    path,
    name,
    projectType,
    initializeGit,
    installPackages,
  });
  await logNextSteps({
    path,
    name,
    initializeGit,
    installPackages,
  });
};

cli();
