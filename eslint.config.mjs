import eslintPluginAstro from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.astro/**",
      "**/.vercel/**",
      "**/pnpm-lock.yaml",
    ],
  },
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      "max-len": [
        "warn",
        {
          code: 100,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
      "no-console": "warn",
      "no-debugger": "error",
    },
  },
  eslintConfigPrettier,
];
