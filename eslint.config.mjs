import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  // Use Next.js + TypeScript recommended configs
  ...nextVitals,
  ...nextTs,

  // Custom configuration
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]);
