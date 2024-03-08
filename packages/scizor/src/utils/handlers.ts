export const getMethodKey = (method: string) => {
  const key = method.toLowerCase();
  if (key === "del") return "delete";
  return key;
};
