import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { router } from "scizor";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(
  "/api",
  await router({
    directory: path.join(__dirname, "app"),
  }),
);

app.listen(3000);