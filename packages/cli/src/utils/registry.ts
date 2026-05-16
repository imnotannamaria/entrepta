import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

/**
 * Resolve the root directory of @entrepta/registry inside node_modules. Throws
 * a friendly error if the package is missing so callers can show a clear hint.
 */
export function getRegistryRoot(): string {
  try {
    return path.dirname(require.resolve("@entrepta/registry/package.json"));
  } catch {
    throw new Error(
      "@entrepta/registry is not installed. " +
        "Reinstall the CLI dependencies (npm install / pnpm install / yarn / bun install) " +
        "and try again."
    );
  }
}
