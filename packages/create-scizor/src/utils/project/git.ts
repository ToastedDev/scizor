import { execSync } from "child_process";
import path from "path";
import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import ora from "ora";
import inquirer from "inquirer";

const isGitInstalled = (dir: string): boolean => {
  try {
    execSync("git --version", { cwd: dir });
    return true;
  } catch (_e) {
    return false;
  }
};

/** @returns Whether or not the provided directory has a `.git` subdirectory in it. */
export const isRootGitRepo = (dir: string): boolean => {
  return fs.existsSync(path.join(dir, ".git"));
};

/** @returns Whether or not this directory or a parent directory has a `.git` directory. */
export const isInsideGitRepo = async (dir: string): Promise<boolean> => {
  try {
    // If this command succeeds, we're inside a git repo
    await execa("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: dir,
      stdout: "ignore",
    });
    return true;
  } catch (_e) {
    // Else, it will throw a git-error and we return false
    return false;
  }
};

const getGitVersion = () => {
  const stdout = execSync("git --version").toString().trim();
  const gitVersionTag = stdout.split(" ")[2];
  const major = gitVersionTag?.split(".")[0];
  const minor = gitVersionTag?.split(".")[1];
  return { major: Number(major), minor: Number(minor) };
};

/** @returns The git config value of "init.defaultBranch". If it is not set, returns "main". */
const getDefaultBranch = () => {
  const stdout = execSync("git config --global init.defaultBranch || echo main")
    .toString()
    .trim();

  return stdout;
};

// This initializes the Git-repository for the project
export const initializeGit = async (projectPath: string) => {
  console.log();
  console.log(chalk.cyan("Initializing Git..."));
  if (!isGitInstalled(projectPath)) {
    console.log(
      chalk.yellow("Git is not installed. Skipping Git initialization."),
    );
    return;
  }

  const spinner = ora("Creating a new git repository...\n").start();

  const isRoot = isRootGitRepo(projectPath);
  const isInside = await isInsideGitRepo(projectPath);
  const dirName = path.parse(projectPath).name; // skip full path for logging

  if (isInside && isRoot) {
    // Dir is a root git repo
    spinner.stop();
    const { overwriteGit } = await inquirer.prompt<{ overwriteGit: boolean }>({
      type: "confirm",
      name: "overwriteGit",
      message: `${chalk.redBright.bold(
        "Warning:",
      )} Git is already initialized in "${dirName}". Initializing a new git repository would delete the previous history. Would you like to continue anyways?`,
      default: false,
    });

    if (!overwriteGit) {
      spinner.info("Skipping Git initialization.");
      return;
    }
    // Deleting the .git folder
    fs.removeSync(path.join(projectPath, ".git"));
  } else if (isInside && !isRoot) {
    // Dir is inside a git worktree
    spinner.stop();
    const { initializeChildGitRepo } = await inquirer.prompt<{
      initializeChildGitRepo: boolean;
    }>({
      type: "confirm",
      name: "initializeChildGitRepo",
      message: `${chalk.redBright.bold(
        "Warning:",
      )} "${dirName}" is already in a git worktree. Would you still like to initialize a new git repository in this directory?`,
      default: false,
    });
    if (!initializeChildGitRepo) {
      spinner.info("Skipping Git initialization.");
      return;
    }
  }

  // We're good to go, initializing the git repo
  try {
    const branchName = getDefaultBranch();

    // --initial-branch flag was added in git v2.28.0
    const { major, minor } = getGitVersion();
    if (major < 2 || (major == 2 && minor < 28)) {
      await execa("git", ["init"], { cwd: projectPath });
      // symbolic-ref is used here due to refs/heads/master not existing
      // It is only created after the first commit
      // https://superuser.com/a/1419674
      await execa("git", ["symbolic-ref", "HEAD", `refs/heads/${branchName}`], {
        cwd: projectPath,
      });
    } else {
      await execa("git", ["init", `--initial-branch=${branchName}`], {
        cwd: projectPath,
      });
    }
    await execa("git", ["add", "."], { cwd: projectPath });
    spinner.succeed(
      `${chalk.green("Successfully initialized and staged")} ${chalk.green.bold(
        "git",
      )}`,
    );
  } catch (error) {
    // Safeguard, should be unreachable
    spinner.fail(
      `${chalk.bold.red(
        "Failed:",
      )} could not initialize git. Update git to the latest version!\n`,
    );
  }
};
