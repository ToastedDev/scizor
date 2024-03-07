import {
  type Express,
  Router as ExpressRouter,
  type RouterOptions,
} from "express";
import { dirname, join } from "path";
import { getHandlers, getMethodKey } from "./utils/handlers";
import type { Options } from "./types/options";
import { DEFAULT_METHODS } from "./config";
import { generateRoutes } from "./utils/routes";
import { walkTree } from "./utils/tree";

const CJS_MAIN_FILENAME =
  typeof require !== "undefined" && require.main?.filename;

const PROJECT_DIRECTORY = CJS_MAIN_FILENAME
  ? dirname(CJS_MAIN_FILENAME)
  : process.cwd();

type ExpressLike = Express | ExpressRouter;

export function createRouter(app: ExpressLike, options: Options = {}) {
  new Router(app, options);
  return app;
}

export const router = (
  options: Options & { routerOptions?: RouterOptions } = {},
) => {
  const routerOptions = options?.routerOptions || {};
  return createRouter(ExpressRouter(routerOptions), options);
};

export class Router {
  options: Options = {};

  constructor(app: ExpressLike, options: Options = {}) {
    this.options = options;
    this.setup(app);
  }

  async setup(app: ExpressLike) {
    const files = walkTree(
      this.options.directory ?? join(PROJECT_DIRECTORY, "app"),
    );
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
  }
}
