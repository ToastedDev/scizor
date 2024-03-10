import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { typedocPlugin } from "./src/utils/typedoc/plugin";
import react from "@astrojs/react";
import { lightTheme } from "./src/utils/themes/light";
import { darkTheme } from "./src/utils/themes/dark";

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
  markdown: {
    shikiConfig: {
      experimentalThemes: {
        light: lightTheme,
        dark: darkTheme,
      },
    },
  },
});
