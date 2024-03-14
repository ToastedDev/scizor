export interface ProjectOptions {
  path: string;
  name: string;
  projectType: ProjectType;
  projectLanguage: ProjectLanguage;
  initializeGit: boolean;
  installPackages: boolean;
}

export type ProjectType = "express" | "hono";
export type ProjectLanguage = "javascript" | "typescript";
