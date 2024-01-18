export const GET = (req, res) => {
  const { id } = req.params;
  return res.json({
    id,
  });
};
