import chalk from "chalk";
import type { ProjectOptions } from "../../types/project-options.js";
import { getUserPackageManager } from "../package-manager.js";
import { isInsideGitRepo, isRootGitRepo } from "./git.js";

export const logNextSteps = async (
  options: Omit<ProjectOptions, "projectFramework" | "projectLanguage">,
) => {
  const packageManager = getUserPackageManager();

  console.log(chalk.cyan("\nNext steps:"));
  options.path !== "." && console.log(`  cd ${options.path}`);

  if (!options.installPackages) {
    switch (packageManager) {
      case "yarn":
        {
          console.log(`  ${packageManager}`);
        }
        break;
      default:
        {
          console.log(`  ${packageManager} install`);
        }
        break;
    }
  }

  if (!(await isInsideGitRepo(options.path)) && !isRootGitRepo(options.path))
    console.log("  git init");
  console.log('  git commit -m "initial commit"');
};
