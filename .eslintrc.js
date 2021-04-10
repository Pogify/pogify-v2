module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "airbnb",
    "plugin:sonarjs/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-console": ["warn", { allow: ["error"] }],
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "no-use-before-define": "off",
    "no-underscore-dangle": ["error", { allowAfterThis: true }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        mjs: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "@typescript-eslint/prefer-ts-expect-error": "warn",
    "eslint-comments/disable-enable-pair": ["warn", { allowWholeFile: true }],
    "react/jsx-props-no-spreading": ["error", { html: "ignore" }],
    "react/no-unescaped-entities": ["warn", { forbid: [">"] }],
    "react/require-default-props": "off",
    "jsx-a11y/label-has-associated-control": ["error", { assert: "either" }],
    "react/jsx-filename-extension": [1, { extensions: [".jsx", ".tsx"] }],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
  },
  overrides: [
    {
      files: [
        "*.test.js?(x)",
        "*.spec.js?(x)",
        "*.test.ts?(x)",
        "*.spec.ts?(x)",
        "*.stories.ts?(x)",
      ],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "import/named": "off",
        "react/jsx-props-no-spreading": "off",
        "react/prop-types": "off",
      },
    },
  ],
};
