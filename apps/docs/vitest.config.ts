import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  esbuild: { jsx: "automatic" },
  test: {
    environment: "node",
    // the editor pieces are components: they render in jsdom, with the registry's test setup (test/setup.ts)
    environmentMatchGlobs: [["components/**/*.test.tsx", "jsdom"]],
    setupFiles: ["./test/setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
    globals: true,
  },
});
