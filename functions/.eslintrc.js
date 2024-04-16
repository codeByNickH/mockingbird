module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    'ecmaVersion': 2020,
  },
  extends: [
    'eslint:recommended',
    // 'google',
  ],
  rules: {},
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
