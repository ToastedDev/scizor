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

## Usage

To initialize your router, add the `router` middleware to your app.

```js
import express from "express";
import { router } from "scizor";

const app = express();
app.use(await router());

app.listen(3000);
```

Or you can use the `createRouter()` function.

```js
import express from "express";
import { router } from "scizor";

const app = express();
createRouter(app);

app.listen(3000);
```

Then, to create routes, just create a folder called `app`, and create subfolders for your routes.

```
app
└── hello
    └── route.js
```

The `route.js` file is your actual route that gets called when you go to `http://localhost:3000/hello`. You can export a `GET` function to handle `GET` requests.

```js
export const GET = (req, res) => {
  res.json({
    hello: "world!",
  });
};
```

The same goes for other HTTP methods.

```js
export const GET = (req, res) => {
  return res.json({
    message: "hello from GET!",
  });
};

export const POST = (req, res) => {
  return res.json({
    message: "hello from POST!",
  });
};

export const PUT = (req, res) => {
  return res.json({
    message: "hello from PUT!",
  });
};

export const PATCH = (req, res) => {
  return res.json({
    message: "hello from PATCH!",
  });
};

export const DELETE = (req, res) => {
  return res.json({
    message: "hello from DELETE!",
  });
};
```

To add URL parameters, you can add a folder named `[parameter]`, where `parameter` is your parameter name.

```
app
└── hello
    └── [id]
        └── route.js
```

You can also do it the "express way" with `:parameter`.

```
app
└── hello
    └── :id
        └── route.js
```

Then to access the parameter, you can use `req.params`, as if you were in a normal `app.get()` function.

```js
export const GET = (req, res) => {
  const { id } = req.params;
  return res.json({ id });
};
```
