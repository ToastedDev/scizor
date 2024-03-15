<img align="right" src="https://github.com/ToastedDev/scizor/assets/50563138/79e9bdd0-cac3-4e6a-b093-b48f77710b4a" width="150">

# Scizor

The perfect way to manage the routes in your backend.

## Installation

```bash
# npm
npm install scizor

# yarn
yarn add scizor

# pnpm
pnpm add scizor

# bun
bun add scizor
```

## Initialization

### Express

```js
import express from "express";
import { createRouter } from "scizor/express";

const app = express();
createRouter(app);

app.listen(3000);
```

### Hono

This assumes you use Bun. You can always add an adapter like [`@hono/node-server`](https://github.com/honojs/node-server) to run it in Node.

```js
import Hono from "hono";
import { createRouter } from "scizor/hono";

const app = new Hono();
createRouter(app);

export default app;
```

## Creating a route

### Express

```js
// app/hello/route.js
export const GET = (req, res) =>
  res.json({
    hello: "world!",
  });
```

### Hono

```js
// app/hello/route.js
export const GET = (c) =>
  c.json({
    hello: "world!",
  });
```

## TypeScript

When creating routes, you can use the `Route` type to get type safety.

```ts
// app/hello/route.ts
import type { Route } from "scizor/express";

export const GET: Route = (req, res) =>
  res.json({
    hello: "world!",
  });
```
