import tsParser from '@typescript-eslint/parser';
import { base } from '@yuvadevlab/eslint-config';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...base,
  {
    ignores: ['**/dist/**', '**/build/**', '**/node_modules/**', '**/*.config.ts'],
  },
];
