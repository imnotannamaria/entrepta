import fs from "node:fs/promises";
import path from "node:path";
import prompts from "prompts";
import { COMPONENTS, COMPONENT_FOLDERS } from "../registry/components.js";
import { ConfigError, aliasToPath, readConfig } from "../utils/config.js";
import { log } from "../utils/logger.js";
import { detectPackageManager, installDeps } from "../utils/package-manager.js";
import {
  OutsideProjectError,
  assertInsideProject,
  writeProjectFile,
} from "../utils/project-path.js";
import { getRegistryRoot } from "../utils/registry.js";

export async function add(components: string[], options: { overwrite: boolean }) {
  const cwd = process.cwd();

  let config: Awaited<ReturnType<typeof readConfig>>;
  try {
    config = await readConfig(cwd);
  } catch (error) {
    if (!(error instanceof ConfigError)) throw error;
    log.error(`${error.message} Fix it, or run \`npx @entrepta/cli@latest init --overwrite\`.`);
    process.exit(1);
  }
  if (!config) {
    log.error("entrepta.json not found. Run `npx @entrepta/cli@latest init` first.");
    process.exit(1);
  }

  if (COMPONENTS.length === 0) {
    log.warn("No components available yet. Check back after the registry is populated.");
    return;
  }

  let selected: string[] = components;
  if (selected.length === 0) {
    const { picks } = await prompts({
      type: "multiselect",
      name: "picks",
      message: "Select components to add:",
      // hooks and lib files arrive as dependencies of the components that need them
      choices: COMPONENTS.filter((c) => c.category !== "hooks" && c.category !== "lib").map(
        (c) => ({
          title: `${c.name}  ${c.description}`,
          value: c.name,
        })
      ),
    });
    if (!picks || picks.length === 0) {
      log.warn("No components selected.");
      return;
    }
    selected = picks as string[];
  }

  const known = new Set(COMPONENTS.map((c) => c.name));
  const unknown = selected.filter((name) => !known.has(name));
  if (unknown.length > 0) {
    log.error(`Unknown component(s): ${unknown.join(", ")}`);
    const available = COMPONENTS.filter((c) => c.category !== "hooks" && c.category !== "lib")
      .map((c) => c.name)
      .join(", ");
    log.info(`Available: ${available}`);
    process.exit(1);
  }

  const toInstall = resolveComponents(selected);

  let registryRoot: string;
  try {
    registryRoot = getRegistryRoot();
  } catch (err) {
    log.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
  const allNpmDeps: string[] = [];

  for (const name of toInstall) {
    const component = COMPONENTS.find((c) => c.name === name);
    if (!component) {
      log.warn(`Component "${name}" not found in registry. Skipping.`);
      continue;
    }

    log.step(`Adding ${name}...`);

    for (const file of component.files) {
      const src = path.join(registryRoot, file);
      const baseAlias =
        component.category === "hooks"
          ? (config.aliases.hooks ?? "@/hooks")
          : component.category === "lib"
            ? (config.aliases.lib ?? "@/lib")
            : config.aliases.components;
      const destRelative = path.join(aliasToPath(baseAlias, config.srcDir), path.basename(file));
      const dest = path.join(cwd, destRelative);

      // A tampered entrepta.json ("components": "@/../../etc") or a symlinked
      // folder in a cloned repo would send the write elsewhere. Checked before
      // the overwrite prompt, so nobody is asked about a file that is not theirs.
      try {
        await assertInsideProject(cwd, dest);
      } catch (error) {
        if (!(error instanceof OutsideProjectError)) throw error;
        log.error(
          `Refusing to write outside the project: ${error.message} Check the aliases in entrepta.json and the folders they point at.`
        );
        process.exit(1);
      }

      const destExists = await fileExists(dest);
      if (destExists && !options.overwrite) {
        const { confirm } = await prompts({
          type: "confirm",
          name: "confirm",
          message: `${destRelative} already exists. Overwrite?`,
          initial: false,
        });
        if (!confirm) {
          log.warn(`Skipped ${destRelative}.`);
          continue;
        }
      }

      let content = await fs.readFile(src, "utf-8");
      content = rewriteImports(
        content,
        config.aliases.utils,
        config.aliases.hooks,
        config.aliases.lib ?? "@/lib"
      );
      await writeProjectFile(cwd, dest, content);
      log.success(`Copied ${destRelative}`);
    }

    allNpmDeps.push(...component.deps);
  }

  const uniqueDeps = [...new Set(allNpmDeps)];
  if (uniqueDeps.length > 0) {
    log.step("Installing dependencies...");
    const pm = await detectPackageManager(cwd);
    try {
      await installDeps(uniqueDeps, cwd, pm);
      log.success("Dependencies installed.");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      log.error(`Failed to install dependencies: ${message}`);
      log.info(`Install them manually: ${pm} add ${uniqueDeps.join(" ")}`);
      process.exit(1);
    }
  }

  log.success(`\nAdded: ${toInstall.join(", ")}`);
}

export function resolveComponents(names: string[]): string[] {
  const resolved = new Set<string>();
  const visiting = new Set<string>();

  function resolve(name: string) {
    if (resolved.has(name) || visiting.has(name)) return;
    const component = COMPONENTS.find((c) => c.name === name);
    if (!component) return;
    visiting.add(name);
    for (const dep of component.registryDeps) {
      resolve(dep);
    }
    visiting.delete(name);
    resolved.add(name);
  }

  for (const name of names) {
    resolve(name);
  }

  return [...resolved];
}

// An import from one component folder to another: `../content/diamond`.
const SIBLING_IMPORT = new RegExp(
  `from\\s+["']\\.\\.[/\\\\](?:${COMPONENT_FOLDERS.join("|")})[/\\\\]([A-Za-z0-9_-]+)["']`,
  "g"
);

/**
 * Registry files import across folders (`../lib/utils`, `../hooks/use-mode`,
 * `../content/diamond`). In a user project every component lands in one
 * folder, so those paths are rewritten to the configured aliases, and imports
 * between component categories become siblings.
 */
export function rewriteImports(
  content: string,
  utilsAlias: string,
  hooksAlias: string,
  libAlias = "@/lib"
): string {
  // Reject aliases that contain string-breaking characters. We're about to
  // splice them into string literals in source code we're writing to disk;
  // quotes / backslashes / newlines would let a tampered config inject
  // arbitrary code into the generated file.
  for (const [name, value] of [
    ["utils", utilsAlias],
    ["hooks", hooksAlias],
    ["lib", libAlias],
  ] as const) {
    if (/["'\\\n\r`]/.test(value)) {
      throw new Error(
        `Invalid ${name} alias in entrepta.json: ${JSON.stringify(value)}. Aliases cannot contain quotes, backslashes, backticks or newlines.`
      );
    }
  }
  // $ has special meaning ($&, $1…$9, $') in String.prototype.replace
  // replacement strings — escape it so the alias is taken literally.
  const safeUtils = utilsAlias.replace(/\$/g, "$$$$");
  const safeHooks = hooksAlias.replace(/\$/g, "$$$$");
  const safeLib = libAlias.replace(/\$/g, "$$$$");
  return content
    .replace(/from\s+["'](\.\.[/\\])*lib[/\\]utils["']/g, `from "${safeUtils}"`)
    .replace(
      /from\s+["']\.\.[/\\]lib[/\\]([A-Za-z0-9_-]+)["']/g,
      (_match, name: string) => `from "${safeLib}/${name.replace(/\$/g, "$$$$")}"`
    )
    .replace(
      /from\s+["']\.\.[/\\]hooks[/\\]([A-Za-z0-9_-]+)["']/g,
      (_match, name: string) => `from "${safeHooks}/${name.replace(/\$/g, "$$$$")}"`
    )
    .replace(SIBLING_IMPORT, (_match, name: string) => `from "./${name}"`);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
