module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "standard"
  ],
  plugins: [
    "@typescript-eslint/eslint-plugin"
  ],
  parser: "@typescript-eslint/parser",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "@typescript-eslint/explicit-module-boundary-types": [0],
    "@typescript-eslint/no-explicit-any": [0],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      vars: "all",
      args: "after-used",
      argsIgnorePattern: "^__"
    }]
  }
};
