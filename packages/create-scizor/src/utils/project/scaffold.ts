import fs from "fs-extra";
import { join } from "path";
import { PKG_ROOT } from "../../config.js";
import ora from "ora";
import chalk from "chalk";
import type { PackageJson } from "type-fest";
import { getUserPackageManager } from "../package-manager.js";
import { execa } from "execa";
import inquirer from "inquirer";

export const scaffoldProject = async (
  path: string,
  name: string,
  projectType: string,
) => {
  const spinner = ora(`Scaffolding in: ${path}...`).start();

  if (fs.existsSync(path)) {
    if (fs.readdirSync(path).length === 0) {
      if (path !== ".")
        spinner.info(
          `${chalk.cyan.bold(path)} exists but is empty, continuing...\n`,
        );
    } else {
      spinner.stopAndPersist();
      const { overwriteDir } = await inquirer.prompt<{ overwriteDir: string }>({
        type: "list",
        name: "overwriteDir",
        message: `${chalk.redBright.bold("Warning:")} ${chalk.cyan.bold(
          path,
        )} already exists and isn't empty. How would you like to proceed?`,
        choices: [
          {
            name: "Abort installation (recommended)",
            value: "abort",
          },
          {
            name: "Clear the directory and continue installation",
            value: "clear",
          },
          {
            name: "Continue installation and overwrite conflicting files",
            value: "overwrite",
          },
        ],
        default: "abort",
      });
      if (overwriteDir === "abort") {
        spinner.fail("Aborting installation...");
        process.exit(1);
      }

      const overwriteAction =
        overwriteDir === "clear"
          ? "clear the directory"
          : "overwrite conflicting files";

      const { confirmOverwriteDir } = await inquirer.prompt({
        type: "confirm",
        name: "confirmOverwriteDir",
        message: `Are you sure you want to ${overwriteAction}?`,
        default: false,
      });

      if (!confirmOverwriteDir) {
        spinner.fail("Aborting installation...");
        process.exit(1);
      }

      if (overwriteDir === "clear") {
        spinner.info(`Emptying ${chalk.cyan.bold(path)} and scaffolding..\n`);
        fs.emptyDirSync(path);
      }
    }
  }

  spinner.start();

  fs.copySync(join(PKG_ROOT, "template", projectType), path);

  const packageJson = JSON.parse(
    fs.readFileSync(join(path, "package.json"), {
      encoding: "utf8",
    }),
  ) as PackageJson;
  packageJson.name = name;

  const packageManager = getUserPackageManager();

  // ? Bun doesn't support this field (yet)
  if (packageManager !== "bun") {
    const { stdout } = await execa(packageManager, ["-v"], {
      cwd: path,
    });
    packageJson.packageManager = `${packageManager}@${stdout.trim()}`;
  }

  fs.writeJSONSync(join(path, "package.json"), packageJson, {
    spaces: 2,
  });

  spinner.succeed(
    chalk.green(`${chalk.cyan.bold(name)} scaffolded successfully!`),
  );
};
