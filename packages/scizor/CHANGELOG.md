# scizor

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
