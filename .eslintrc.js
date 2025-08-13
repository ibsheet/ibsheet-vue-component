module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2021,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended", // 👈 Prettier와 충돌하는 규칙을 비활성화 + prettier 플러그인 활성화
    "prettier" // 👈 마지막에 항상 위치시켜야 함
  ],
  plugins: ["vue", "@typescript-eslint", "prettier"],
  rules: {
    // 예: 코드 포맷을 prettier 기준에 맞추도록 강제
    "prettier/prettier": "warn",
  },
};