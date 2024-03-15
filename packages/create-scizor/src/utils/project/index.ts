import { scaffoldProject } from "./scaffold.js";
import { installDependencies } from "./install.js";
import { initializeGit } from "./git.js";
import type { ProjectOptions } from "../../types/project-options.js";

export const createProject = async (options: ProjectOptions) => {
  await scaffoldProject(
    options.path,
    options.name,
    options.projectFramework,
    options.projectLanguage,
  );
  if (options.installPackages) await installDependencies(options.path);
  if (options.initializeGit) await initializeGit(options.path);
};
