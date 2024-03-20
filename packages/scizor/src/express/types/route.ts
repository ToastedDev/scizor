import type { Handler, Request, Response } from "express";

export type Route = Handler;

export type GetRouteType<Route extends Handler> = Route extends (
  req: Request,
  res: Response,
) => Response<any, infer T>
  ? T
  : never;
