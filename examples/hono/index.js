import { Hono } from "hono";
import path from "path";
import { fileURLToPath } from "url";
import { createRouter } from "scizor/hono";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = new Hono();

createRouter(app, {
  directory: path.join(__dirname, "app"),
});

export default app;
