import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Custom rules for French content
  {
    rules: {
      // Disable unescaped entities for French text (apostrophes are common)
      "react/no-unescaped-entities": "off",
      // Allow any in specific cases (to be reviewed)
      "@typescript-eslint/no-explicit-any": "warn",
      // Unused vars as warnings
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow setState in useEffect for initialization patterns
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
