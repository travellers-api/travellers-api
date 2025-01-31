module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: ["/lib/**/*"],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "no-restricted-imports": ["error", { paths: ["dayjs"] }],
    "import/order": ["error", { alphabetize: { order: "asc" } }],
    "import/no-unresolved": [
      "error",
      {
        ignore: ["^firebase-admin/.+", "express"],
      },
    ],
  },
};
