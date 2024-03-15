export interface ProjectOptions {
  path: string;
  name: string;
  projectFramework: ProjectFramework;
  projectLanguage: ProjectLanguage;
  initializeGit: boolean;
  installPackages: boolean;
}

export type ProjectFramework = "express" | "hono";
export type ProjectLanguage = "javascript" | "typescript";
