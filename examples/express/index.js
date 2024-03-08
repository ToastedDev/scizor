import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { router } from "scizor";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(
  router({
    directory: path.join(__dirname, "app"),
  }),
);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
