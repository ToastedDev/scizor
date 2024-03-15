import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { createRouter } from "scizor/hono";

const app = new Hono();
createRouter(app);

// @ts-expect-error Bun is undefined in the node runtime
if (typeof Bun === "undefined") {
  serve(
    {
      fetch: app.fetch,
      port: 3000,
    },
    ({ port }) => {
      console.log("Listening on port %s.", port);
    },
  );
}

export default app;
