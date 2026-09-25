import fs from "node:fs/promises";
import path from "node:path";

export interface EntryptaConfig {
  $schema?: string;
  theme: string;
  /** "all" writes the six themes, switchable through data-theme on <html>. */
  themes?: "single" | "all";
  /** Where `@/` points, such as "src" for Vite. Aliases resolve relative to it. */
  srcDir?: string;
  tsx: boolean;
  rsc: boolean;
  tailwind: {
    css: string;
    baseColor: string;
  };
  aliases: {
    components: string;
    lib: string;
    utils: string;
    hooks: string;
  };
}

const CONFIG_FILE = "entrepta.json";

export async function readConfig(cwd: string): Promise<EntryptaConfig | null> {
  try {
    const content = await fs.readFile(path.join(cwd, CONFIG_FILE), "utf-8");
    return JSON.parse(content) as EntryptaConfig;
  } catch {
    return null;
  }
}

export async function writeConfig(cwd: string, config: EntryptaConfig): Promise<void> {
  await fs.writeFile(path.join(cwd, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`, "utf-8");
}

/**
 * The folder an alias such as `@/hooks` points at, relative to the project root.
 * An alias without `@/` is taken as a path already.
 */
export function aliasToPath(alias: string, srcDir = ""): string {
  const rest = alias.replace(/^@\//, "");
  return alias.startsWith("@/") && srcDir ? `${srcDir}/${rest}` : rest;
}
