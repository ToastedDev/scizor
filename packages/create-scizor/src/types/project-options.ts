export interface ProjectOptions {
  path: string;
  name: string;
  projectType: ProjectType;
  initializeGit: boolean;
  installPackages: boolean;
}

export type ProjectType = "javascript" | "typescript";
