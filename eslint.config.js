// eslint.config.js — ESLint rules for the ReadSpace app (run: npm install, then npm run lint).
export default [
  {
    files: ["app/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      // Browser globals the app uses (listed here so no extra package is needed).
      globals: {
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        CustomEvent: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "error",
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: "error",
      "no-console": "warn",
    },
  },
];
