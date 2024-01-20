import inquirer from "inquirer";
import { getUserPackageManager } from "./utils/package-manager.js";
import { removeTrailingSlash } from "./utils/trailing-slash.js";
import type { ProjectType } from "./types/project-options.js";

const validationRegExp =
  /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

const validateAppName = (rawInput: string) => {
  const input = removeTrailingSlash(rawInput);
  const paths = input.split("/");

  // If the first part is a @, it's a scoped package
  const indexOfDelimiter = paths.findIndex((p) => p.startsWith("@"));
  let appName = paths[paths.length - 1];
  if (paths.findIndex((p) => p.startsWith("@")) !== -1) {
    appName = paths.slice(indexOfDelimiter).join("/");
  }

  if (input === "." || validationRegExp.test(appName ?? "")) {
    return true;
  } else {
    return "App name must consist of only lowercase alphanumeric characters, '-', and '_'";
  }
};

export async function promptForDirectory({
  directory,
}: {
  directory: string | undefined;
}) {
  if (directory) return directory;

  const { projectDirectory } = await inquirer.prompt<{
    projectDirectory: string;
  }>({
    type: "input",
    name: "projectDirectory",
    message: "What will your project be called?",
    default: directory ?? "./my-scizor-backend",
    validate: validateAppName,
  });
  return projectDirectory;
}

export async function promptForProjectType({
  providedProjectType,
}: {
  providedProjectType: string | undefined;
}): Promise<ProjectType> {
  if (providedProjectType) {
    switch (providedProjectType) {
      case "js": {
        return "javascript";
      }
      case "ts": {
        return "typescript";
      }
      default: {
        return providedProjectType as ProjectType;
      }
    }
  }

  const { projectType } = await inquirer.prompt<{
    projectType: "javascript" | "typescript";
  }>({
    type: "list",
    name: "projectType",
    message: "What do you want to use for this project?",
    choices: [
      {
        name: "JavaScript",
        value: "javascript",
      },
      {
        name: "TypeScript",
        value: "typescript",
      },
    ],
    default: "javascript",
  });
  return projectType;
}

export async function promptForGit({
  skipGit,
}: {
  skipGit: boolean | undefined;
}) {
  if (typeof skipGit !== "undefined") return !skipGit;

  const { shouldInitializeGit } = await inquirer.prompt<{
    shouldInitializeGit: boolean;
  }>({
    type: "confirm",
    name: "shouldInitializeGit",
    message: "Should git be initialized in this project?",
    default: true,
  });
  return shouldInitializeGit;
}

export async function promptForInstall({
  skipInstall,
}: {
  skipInstall: boolean | undefined;
}) {
  if (typeof skipInstall !== "undefined") return !skipInstall;

  const packageManager = getUserPackageManager();
  const { shouldInstallPackages } = await inquirer.prompt<{
    shouldInstallPackages: boolean;
  }>({
    type: "confirm",
    name: "shouldInstallPackages",
    message: `Should we run '${
      packageManager === "yarn" ? packageManager : `${packageManager} install`
    }' for you?`,
    default: true,
  });
  return shouldInstallPackages;
}
