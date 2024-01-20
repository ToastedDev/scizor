import { Route } from "scizor";

export const GET: Route = (req, res) => {
  return res.json({
    hello: "world",
  });
};
