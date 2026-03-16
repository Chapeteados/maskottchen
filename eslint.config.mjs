import eslintPluginAstro from "eslint-plugin-astro";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // Personalizable:
      "no-console": "warn",
      "no-debugger": "error",
    },
  },
];

