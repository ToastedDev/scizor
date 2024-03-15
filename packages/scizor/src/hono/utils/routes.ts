import type { Exports } from "../types/exports";
import type { File } from "../../utils/tree";
import { join, parse } from "path";
import { buildRoute, buildUrl, calculatePriority } from "../../utils/routes";

interface Route {
  url: string;
  priority: number;
  exports: Exports;
}

export const generateRoutes = async (files: File[]) => {
  const routes: Route[] = [];
  for (const file of files) {
    const parsedFile = parse(file.rel);
    const route = buildRoute(parsedFile);
    const url = buildUrl(route);
    const priority = calculatePriority(url);
    const exports = await import(join(file.path, file.name));

    if (parsedFile.name.startsWith("route") && exports.default)
      throw new Error(`Route '${route}' must not have a default export`);

    routes.push({
      url,
      priority,
      exports,
    });
  }

  return routes.sort((a, b) => a.priority - b.priority);
};
