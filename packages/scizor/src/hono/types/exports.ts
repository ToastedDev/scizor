import type { Handler } from "hono/types";

export type MethodExport = Handler | Handler[];

export interface MethodExports {
  get?: MethodExport;
  post?: MethodExport;
  put?: MethodExport;
  patch?: MethodExport;
  delete?: MethodExport;
  head?: MethodExport;
  connect?: MethodExport;
  options?: MethodExport;
  trace?: MethodExport;

  [x: string]: MethodExport | undefined;
}

export type Exports = MethodExports & {
  default?: any;
};
