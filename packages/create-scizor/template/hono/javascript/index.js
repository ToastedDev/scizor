import { Hono } from "hono";
import { createRouter } from "scizor/hono";

const app = new Hono();
createRouter(app);

export default app;
