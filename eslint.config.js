import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintReact from '@eslint-react/eslint-plugin';
import importX from 'eslint-plugin-import-x';
import daStyle from 'eslint-config-dicodingacademy';

export default defineConfig(
  globalIgnores(['dist']),

  daStyle,

  js.configs.recommended,

  eslintReact.configs.recommended,

  {
    plugins: {
      'import-x': importX,
    },
    rules: {
      'import-x/first': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/newline-after-import': 'warn',
      'import-x/prefer-default-export': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/extensions': 'off',
    },
  },

  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      'no-console': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-param-reassign': ['error', { props: false }],
      'object-shorthand': ['error', 'always'],
      'arrow-body-style': ['error', 'as-needed'],
      'eol-last': ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@eslint-react/no-missing-key': 'warn',
      '@eslint-react/dom-no-dangerously-set-innerhtml': 'off',
    },
    settings: {
      react: {
        version: '19',
      },
    },
  },

  {
    files: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },

  {
    files: ['*.config.js', '*.config.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
);
