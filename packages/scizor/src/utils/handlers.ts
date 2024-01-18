import type { MethodExport } from "../types/exports";

export const getHandlers = (handler: MethodExport) => {
  if (Array.isArray(handler) && handler.every((h) => typeof h === "function"))
    return handler;
  else if (typeof handler === "function") return [handler];
  else return [];
};
