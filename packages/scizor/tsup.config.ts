import { defineConfig } from "tsup";
import { execSync } from "child_process";

export default defineConfig({
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  entry: ["./src/index.ts"],
  external: ["express"],
  async onSuccess() {
    // emit dts and sourcemaps to enable jump to definition
    execSync("pnpm tsc --project tsconfig.sourcemap.json");
  },
});
