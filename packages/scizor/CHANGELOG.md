# scizor

## 0.1.0

### Minor Changes

- f0e99c3: Add support for [`Hono`](https://hono.dev).
- 52f5b2e: No more need for `await` when creating routers.

  This is done by moving the logic for when routers are created to a new `Router` class that is created whenever you run `createRouter` or `router`.

### Patch Changes

- 759066f: Add `GetRouteType` type. This allows you to get the type of what a route's response is.

  ```ts
  // src/api/hello/route.ts
  import { Route } from "scizor/hono";

  export const GET = (c) => c.json({ hello: "world" });

  // src/index.ts
  import type { GetRouteType } from "scizor/hono";
  import { GET } from "./api/hello/route";

  async function callAPI() {
    const res = await fetch("http://localhost:3000/api/hello");
    const data: GetRouteType<typeof GET> = await res.json();
    console.log(data);
    //          ^? { hello: string }
  }

  callAPI();
  ```

- 5e8cc82: Allow `src/app` directory by default.

## 0.0.2

### Patch Changes

- 67e016e: Fix `module is not defined in ES module scope` error.
- 2dd6e27: Add provenance.

## 0.0.1

### Patch Changes

- 62b7e85: First version of scizor. Adds creating of `router` and loading routes.

  ```js
  import express from "express";
  import { router } from "scizor";

  const app = express();
  app.use(await router());
  // or:
  // createRouter(app);

  app.listen(3000);
  ```
