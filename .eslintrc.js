module.exports = {
  env: {
    mocha: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base','prettier'],
  plugins:['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "func-names": ["error", "never"],
    "no-console": "off",
    "prettier/prettier":"error",
    "class-methods-use-this":"off",
    "no-param-reassign":"off",
    "camelcase":"off",
    "no-unused-vars":["error",{"argsIgnorePattern":"next"}]
  },
};
