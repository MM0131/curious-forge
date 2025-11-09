module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    extraFileExtensions: ['.vue']
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
  ,
  overrides: [
    {
      files: ['tests/**/*.ts', 'tests/**/*.js'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off'
      }
    }
    ,
    {
      files: ['scripts/**/*.js', 'scripts/**/*.mjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'unicorn/prefer-top-level-await': 'off',
        'sonarjs/cognitive-complexity': 'off'
      }
    }
  ]
}
