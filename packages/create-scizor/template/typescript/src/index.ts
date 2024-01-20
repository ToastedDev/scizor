import express from "express";
import path from "path";
import { router } from "scizor";

const app = express();
app.use(
  await router({
    directory: path.join(process.cwd(), "src/app"),
  }),
);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
