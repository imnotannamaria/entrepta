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

// An alias or a folder: letters, digits, @, dot, dash, underscore and slashes.
// No quotes, spaces or newlines, since an alias is written into import lines.
const SAFE_PATH = /^[\w@./-]+$/;

/**
 * What is wrong with a parsed entrepta.json, in plain words. The file can come
 * from a cloned repo, and its aliases end up inside the import lines the CLI
 * writes, so it is checked before anything uses it.
 */
export function configProblems(value: unknown): string[] {
  if (!value || typeof value !== "object") return ["it is not a JSON object"];
  const config = value as Record<string, unknown>;
  const problems: string[] = [];
  if (typeof config.theme !== "string") problems.push('"theme" must be a string');
  if (config.themes !== undefined && config.themes !== "single" && config.themes !== "all") {
    problems.push('"themes" must be "single" or "all"');
  }
  if (config.srcDir !== undefined) {
    if (
      typeof config.srcDir !== "string" ||
      (config.srcDir !== "" && !SAFE_PATH.test(config.srcDir))
    ) {
      problems.push('"srcDir" must be a plain folder name, such as "src"');
    } else if (config.srcDir.split("/").includes("..")) {
      problems.push('"srcDir" cannot point outside the project');
    }
  }
  const aliases = config.aliases as Record<string, unknown> | undefined;
  if (!aliases || typeof aliases !== "object") {
    problems.push('"aliases" is missing');
  } else {
    for (const key of ["components", "lib", "utils", "hooks"]) {
      const alias = aliases[key];
      if (typeof alias !== "string" || !SAFE_PATH.test(alias)) {
        problems.push(`"aliases.${key}" must be a path such as "@/${key}"`);
      }
    }
  }
  return problems;
}

export class ConfigError extends Error {}

/** The project's entrepta.json, or null when there is none. Throws ConfigError when it is invalid. */
export async function readConfig(cwd: string): Promise<EntryptaConfig | null> {
  let content: string;
  try {
    content = await fs.readFile(path.join(cwd, CONFIG_FILE), "utf-8");
  } catch {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new ConfigError(`${CONFIG_FILE} is not valid JSON.`);
  }
  const problems = configProblems(parsed);
  if (problems.length) {
    throw new ConfigError(`${CONFIG_FILE} is not valid: ${problems.join("; ")}.`);
  }
  return parsed as EntryptaConfig;
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
