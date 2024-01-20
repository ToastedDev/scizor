import { type ParsedPath, join, parse } from "path";
import { mergePaths } from "./tree";
import type { Exports } from "../types/exports";
import type { File } from "./tree";

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

const buildRoute = (parsedFile: ParsedPath) => {
  const directory = parsedFile.dir === parsedFile.root ? "" : parsedFile.dir;
  const name = parsedFile.name.startsWith("route")
    ? parsedFile.name.replace("route", "")
    : parsedFile.name;
  return directory + name;
};

const buildUrl = (path: string) => {
  const convertParamSyntax = (path: string) => {
    const subpaths: string[] = [];
    for (const subpath of path.split("/")) {
      subpaths.push(transformBrackets(subpath));
    }
    return mergePaths(...subpaths);
  };
  const transformBrackets = (value: string) => {
    const regBrackets = /\[([^}]*)\]/g;
    return regBrackets.test(value)
      ? value.replace(regBrackets, (_, s) => `:${s}`)
      : value;
  };

  const url = convertParamSyntax(path);
  return url.replace(/:\.\.\.\w+/g, "*");
};

const calculatePriority = (url: string) => {
  const depth = url.match(/\/.+?/g)?.length || 0;
  const specifity = url.match(/\/:.+?/g)?.length || 0;
  const catchall = url.match(/\/\*/g)?.length || 0 > 0 ? Infinity : 0;
  return depth + specifity + catchall;
};
