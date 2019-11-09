module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',
          'external',
          'internal'
        ],
        'newlines-between': 'always'
      }
    ],
    'no-unused-expressions': 'warn' // https://github.com/typescript-eslint/typescript-eslint/issues/1138
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ],
  'plugins': ['import']
}
