# scizor

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
