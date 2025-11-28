import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import prettierPlugin from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"
import importPlugin from "eslint-plugin-import"
import unusedImports from "eslint-plugin-unused-imports"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      /* ----- Prettier Integration ----- */
      "prettier/prettier": [
        "error",
        {
          semi: false,
          singleQuote: false,
          tabWidth: 2,
          trailingComma: "es5",
          printWidth: 100,
          arrowParens: "avoid",
          endOfLine: "lf",
        },
      ],

      /* -----  Remove unused imports/vars ----- */
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],

      /* ----- Import sorting rules ----- */
      "import/order": [
        "warn",
        {
          groups: [
            "builtin", // node modules
            "external", // npm packages
            "internal", // absolute imports
            ["parent", "sibling", "index"], // relative imports
            "object", // import type {} from module
            "type", // import type declarations
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
])

export default eslintConfig
