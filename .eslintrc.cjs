module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    // relax a few rules for this project
    'vue/multi-word-component-names': 'off'
    ,
    '@typescript-eslint/no-explicit-any': 'off'
  }
}
