import type { MethodExport } from "../types/exports";

export const getHandlers = (handler: MethodExport) => {
  if (Array.isArray(handler) && handler.every((h) => typeof h === "function"))
    return handler;
  else if (typeof handler === "function") return [handler];
  else return [];
};

export const getMethodKey = (method: string) => {
  const key = method.toLowerCase();
  if (key === "del") return "delete";
  return key;
};
