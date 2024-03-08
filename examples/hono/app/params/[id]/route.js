export const GET = (c) => {
  const { id } = c.req.param();
  return c.json({
    id,
  });
};
