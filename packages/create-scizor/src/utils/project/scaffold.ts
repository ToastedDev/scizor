import fs from "fs-extra";
import { join } from "path";
import { PKG_ROOT } from "../../config.js";
import ora from "ora";
import chalk from "chalk";
import type { PackageJson } from "type-fest";
import { getUserPackageManager } from "../package-manager.js";
import { execa } from "execa";

export const scaffoldProject = async (
  path: string,
  name: string,
  projectType: string,
) => {
  const spinner = ora("Scaffolding project...").start();
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
