import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config[]} */
export default tseslint.config(
  { ignores: ["dist/", "node_modules/", "docs/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    linterOptions: { reportUnusedDisableDirectives: "off" },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
    },
  },
  {
    // The generator's code: its naming and shape are the generator's, and every file
    // opens with `tslint:disable`.
    files: ["src/apis/**/*.ts", "src/models/**/*.ts", "src/runtime.ts"],
    rules: {
      "unused-disable-directives": "off",
      "no-unused-private-class-members": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
