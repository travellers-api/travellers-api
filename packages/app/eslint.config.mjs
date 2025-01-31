// @ts-check

import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tsEslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tsEslint.config(
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
  ...compat.config({
    extends: ["next"],
  }),
  eslintConfigPrettier,
);
