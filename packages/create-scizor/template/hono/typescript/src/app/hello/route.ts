import { Route } from "scizor/hono";

export const GET: Route = (c) => {
  return c.json({
    hello: "world",
  });
};
