import type { Linter } from 'eslint';
import globals from 'globals';

import { base } from './base';

export const node: Linter.Config[] = [
  ...base,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
