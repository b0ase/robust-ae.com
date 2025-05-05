import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import typescriptESLint from '@typescript-eslint/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

// Use the compatibility layer to import the config
const eslintConfig = [
  ...compat.config({ extends: ["next/core-web-vitals"] }),
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      '@typescript-eslint': typescriptESLint
    },
    languageOptions: {
      parser: typescriptESLint.parser
    }
  }
];

export default eslintConfig;
