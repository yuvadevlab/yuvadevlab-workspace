import { react, typescript } from "@yuvadevlab/eslint-config";

export default [
  ...react,
  ...typescript,
  {
    ignores: ["dist/", "node_modules/"],
  },
];
