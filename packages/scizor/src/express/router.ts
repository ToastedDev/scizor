import {
  type Express,
  Router as ExpressRouter,
  type RouterOptions,
} from "express";
import { dirname, join } from "path";
import { getHandlers } from "./utils/handlers";
import { getMethodKey } from "../utils/handlers";
import type { Options } from "../types/options";
import { DEFAULT_METHODS } from "../config";
import { generateRoutes } from "./utils/routes";
import { walkTree } from "../utils/tree";
import { existsSync } from "fs";

const CJS_MAIN_FILENAME =
  typeof require !== "undefined" && require.main?.filename;

const PROJECT_DIRECTORY = CJS_MAIN_FILENAME
  ? dirname(CJS_MAIN_FILENAME)
  : process.cwd();

type ExpressLike = Express | ExpressRouter;

/**
 * Creates a router.
 * @param {ExpressLike} app The app to add the routes to.
 * @param {Options} options Options for the scizor router.
 */
export function createRouter(app: ExpressLike, options: Options = {}) {
  new Router(app, options);
  return app;
}

/**
 * Same as `createRouter`, but can be used for middleware.
 * @param {Options & { routerOptions?: RouterOptions }} options Options for the scizor router and the Express router.
 */
export const router = (
  options: Options & { routerOptions?: RouterOptions } = {},
) => {
  const routerOptions = options?.routerOptions || {};
  return createRouter(ExpressRouter(routerOptions), options);
};

/**
 * Base router.
 */
export class Router {
  private directory!: string;

  /**
   * Create a router.
   * @param {ExpressLike} app The app to add the routes to.
   * @param {Options} options Options for the scizor router.
   */
  constructor(app: ExpressLike, options: Options = {}) {
    if (options?.directory) this.directory = options.directory;
    else {
      if (existsSync(join(PROJECT_DIRECTORY, "src/app")))
        this.directory = join(PROJECT_DIRECTORY, "src/app");
      else if (existsSync(join(PROJECT_DIRECTORY, "app")))
        this.directory = join(PROJECT_DIRECTORY, "app");
      else
        throw new Error(
          "No directory specified, and no default directory found.",
        );
    }

    if (!existsSync(this.directory))
      throw new Error(`Directory '${this.directory}' not found.`);

    this.setup(app);
  }

  /**
   * Setup the router.
   * @param {ExpressLike} app The app to add the routes to.
   */
  async setup(app: ExpressLike) {
    const files = walkTree(this.directory);
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
