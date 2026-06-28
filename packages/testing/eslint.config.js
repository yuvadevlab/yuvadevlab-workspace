import { typescript } from "@yuvadevlab/eslint-config";

export default [
  ...typescript,
  {
    ignores: ["dist/", "node_modules/"],
  },
];
