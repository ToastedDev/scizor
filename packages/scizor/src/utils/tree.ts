import { readdirSync, statSync } from "fs";
import { join } from "path";

export interface File {
  name: string;
  path: string;
  rel: string;
}

export const mergePaths = (...paths: string[]) =>
  "/" +
  paths
    .map((path) => path.replace(/^\/|\/$/g, ""))
    .filter((path) => path !== "")
    .join("/");

export const walkTree = (directory: string, tree: string[] = []) => {
  const results: File[] = [];
  for (const fileName of readdirSync(directory)) {
    const filePath = join(directory, fileName);
    if (statSync(filePath).isDirectory())
      results.push(...walkTree(filePath, [...tree, fileName]));
    else {
      results.push({
        name: fileName,
        path: directory,
        rel: mergePaths(...tree, fileName),
      });
    }
  }
  // TODO: make this error better
  if (!results.length)
    throw new Error(`No route handlers found in '${directory}'`);
  return results;
};
