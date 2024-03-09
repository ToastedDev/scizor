import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { typedocPlugin } from "./src/utils/typedoc/plugin";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    react(),
  ],
  vite: {
    plugins: [typedocPlugin()],
  },
  // for some reason this conflicts
  // eslint-disable-next-line prettier/prettier
});
