export default {
  extends: [
    "eslint:recommended",
    "plugin:@stylistic/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@stylistic", "prettier"],
  rules: {
    "@stylistic/quotes": ["error", "single"],
    "prettier/prettier": ["error", { singleQuote: true }],
  },
};
