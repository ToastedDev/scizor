import { Route } from "scizor/express";

export const GET: Route = (req, res) => {
  return res.json({
    hello: "world",
  });
};
