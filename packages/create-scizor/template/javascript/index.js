import express from "express";
import { router } from "scizor";

const app = express();
app.use(await router());

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
