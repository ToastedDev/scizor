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
export const GET = (req, res) =>
  res.json({
    hello: "world!",
  });
```
