import globals from "globals"
import pluginJs from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  { ignores: ["dist/**", "node_modules/**"] },
  {
    rules: {
      "no-unused-vars": "warn",
    },
  },
  eslintConfigPrettier,
]
