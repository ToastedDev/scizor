import type { Hono } from "hono";
import type { Env, H } from "hono/types";
import { createFactory, type Factory } from "hono/factory";
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

export function createRouter<E extends Env>(
  app: Hono<E>,
  options: Options = {},
) {
  new Router<E>(app, options);
  return app;
}

// TODO: make this work in a future version
// export const router = <E extends Env = Env>(
//   options: Options & { routerOptions?: HonoOptions<E> } = {},
// ) => {
//   const routerOptions = options?.routerOptions || undefined;
//   return createRouter<E>(new Hono(routerOptions), options);
// };

export class Router<E extends Env = Env> {
  directory!: string;
  factory: Factory;

  constructor(app: Hono<E>, options: Options = {}) {
    this.factory = createFactory<E>();

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

  async setup(app: Hono<E>) {
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

        (app as any)[methodKey](
          url,
          ...(this.factory.createHandlers as (...handlers: H[]) => H[])(
            ...methodHandler,
          ),
        );
      }
    }
  }
}
