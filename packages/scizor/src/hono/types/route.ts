import type { Context } from "hono";
import type { Handler, TypedResponse } from "hono/types";

export type Route = Handler;

export type GetRouteType<Route extends Handler> = Route extends (
  c: Context,
) => Response & TypedResponse<infer T>
  ? T
  : never;
