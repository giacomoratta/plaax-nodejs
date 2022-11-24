module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json'
  },
  plugins: [
    '@typescript-eslint',
    'eslint-plugin-import'
  ],
  extends: [
    'eslint:recommended',
    'eslint-config-standard',
    'eslint-config-standard-with-typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'no-console': 0,
    '@typescript-eslint/no-explicit-any': 0
  }
}
