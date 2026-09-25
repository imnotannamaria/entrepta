import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  clean: true,
  // the manifest lives in the registry as TypeScript; bundle it rather than import it at runtime
  noExternal: ["@entrepta/registry"],
  banner: {
    js: "#!/usr/bin/env node",
  },
});
