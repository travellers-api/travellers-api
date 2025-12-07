// @ts-check

import eslint from "@eslint/js";
import eslintNextPlugin from "@next/eslint-plugin-next";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginReact from "eslint-plugin-react";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  {
    ignores: [".next"],
  },
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  tsEslint.configs.stylistic,
  {
    rules: {
      "no-restricted-imports": ["error", { paths: ["dayjs"] }],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat["jsx-runtime"],
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      next: eslintNextPlugin,
    },
    settings: {
      next: {
        rootDir: "packages/app/",
      },
    },
  },
  eslintConfigPrettier,
);
