import { readdirSync, statSync } from "fs";
import { type Express, Router, type RouterOptions } from "express";
import { type ParsedPath, dirname, join, parse } from "path";
import type { Exports } from "./types/exports";
import { getHandlers } from "./utils/handlers";

const CJS_MAIN_FILENAME =
  typeof require !== "undefined" && require.main?.filename;

const PROJECT_DIRECTORY = CJS_MAIN_FILENAME
  ? dirname(CJS_MAIN_FILENAME)
  : process.cwd();

type ExpressLike = Express | Router;
interface File {
  name: string;
  path: string;
  rel: string;
}
interface Route {
  url: string;
  priority: number;
  exports: Exports;
}

export interface Options {
  directory?: string;
}

const DEFAULT_METHODS = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "connect",
  "options",
  "trace",
];

export async function createRouter(app: ExpressLike, options: Options = {}) {
  const files = walkTree(options.directory ?? join(PROJECT_DIRECTORY, "app"));
  const routes = await generateRoutes(files);
  for (const { exports, url } of routes) {
    const exportMethods = Object.entries(exports);
    for (const [method, handler] of exportMethods) {
      if (!handler)
        throw new Error(
          `Handler for method '${method}' in route '${url}' is undefined`,
        );
      const methodKey = getMethodKey(method);
      if (!DEFAULT_METHODS.includes(methodKey)) continue;

      const methodHandler = getHandlers(handler);
      if (methodHandler.length === 0)
        throw new Error(
          `Handler for method '${method}' in route '${url}' is invalid`,
        );

      (app as any)[methodKey](url, ...methodHandler);
    }
  }

  return app;
}

export const router = async (
  options: Options & { routerOptions?: RouterOptions } = {},
) => {
  const routerOptions = options?.routerOptions || {};
  return await createRouter(Router(routerOptions), options);
};

const mergePaths = (...paths: string[]) =>
  "/" +
  paths
    .map((path) => path.replace(/^\/|\/$/g, ""))
    .filter((path) => path !== "")
    .join("/");

const walkTree = (directory: string, tree: string[] = []) => {
  const results: File[] = [];
  for (const fileName of readdirSync(directory)) {
    const filePath = join(directory, fileName);
    if (statSync(filePath).isDirectory())
      results.push(...walkTree(filePath, [...tree, fileName]));
    else {
      // TODO: make this error better
      if (!fileName.startsWith("route"))
        throw new Error(
          `File at '${filePath}' is an invalid route handler. Route handlers must be named 'route.js' or 'route.ts'`,
        );
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

const IS_ESM = typeof module === "undefined" && !(module as any)?.exports;
const MODULE_IMPORT_PREFIX = IS_ESM ? "file://" : "";

const generateRoutes = async (files: File[]) => {
  const routes: Route[] = [];
  for (const file of files) {
    const parsedFile = parse(file.rel);
    const route = buildRoute(parsedFile);
    const url = buildUrl(route);
    const priority = calculatePriority(url);
    const exports = await import(
      MODULE_IMPORT_PREFIX + join(file.path, file.name)
    );

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

const getMethodKey = (method: string) => {
  const key = method.toLowerCase();
  if (key === "del") return "delete";
  return key;
};
