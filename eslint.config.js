// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const globals = require('globals');

const noInlineColors = {
  selector: 'Literal[value=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]',
  message: 'Colors come from design/tokens.ts. Use the theme palette instead of an inline hex value.',
};

module.exports = defineConfig([
  expoConfig,
  prettierRecommended,
  {
    ignores: [
      'dist/*',
      'node_modules/*',
      'android/*',
      'ios/*',
      'proxy/*',
      'widgets/*',
      '.expo/*',
      'public/*',
    ],
  },
  {
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error', noInlineColors],
    },
  },
  {
    files: ['scripts/**/*.js', '*.config.js', 'babel.config.js', 'metro.config.js'],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
]);
