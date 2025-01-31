// @ts-check

import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  {
    ignores: ["dist/*", "jest.config.js", "dotenv-config.js", "*.spec.ts"],
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
  eslintConfigPrettier,
);
