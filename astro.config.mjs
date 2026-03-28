// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Maven Pro",
      cssVariable: "--font-maven-pro",
      weights: [400, 500, 600, 700, 800, 900],
    },
    {
      provider: fontProviders.googleicons(),
      name: "Material Symbols Outlined",
      cssVariable: "--font-icons",
      options: {
        experimental: {
          glyphs: ["menu", "close"],
        },
      },
    },
  ],

  integrations: [react()],
});
