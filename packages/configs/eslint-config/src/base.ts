import js from '@eslint/js';
import type { Linter } from 'eslint';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

export const base: Linter.Config[] = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Core strictness
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all', ignoreReadBeforeAssign: false }],
      'prefer-template': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-eval': 'error',
      'no-alert': 'error',
      'no-debugger': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      curly: ['error', 'all'],
      'dot-notation': 'error',
      'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['draft'] }],
      'no-shadow': 'off',
      'object-shorthand': ['error', 'always'],
      'prefer-destructuring': ['error', { object: true, array: false }],
      'object-curly-newline': ['error', { consistent: true }],
      'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],

      // Complexity & Maintainability
      complexity: ['error', 10],
      'max-lines': ['error', 300],
      'max-lines-per-function': ['warn', 50],
      'max-params': ['error', 4],
      'max-depth': ['error', 4],

      // Import Organization
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-duplicates': 'error',

      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],

      // Restrictions
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Avoid TypeScript enums; prefer union types or const objects.',
        },
      ],
    },
  },
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/storybook-static/**',
      '**/vite.*.ts',
      'commitlint.config.ts',
    ],
  },
  prettier,
];
