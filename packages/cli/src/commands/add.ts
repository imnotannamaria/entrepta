import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import prompts from "prompts";
import { COMPONENTS } from "../registry/components.js";
import { readConfig } from "../utils/config.js";
import { log } from "../utils/logger.js";
import { detectPackageManager, installDeps } from "../utils/package-manager.js";

const require = createRequire(import.meta.url);

function getRegistryRoot(): string {
  return path.dirname(require.resolve("@entrepta/registry/package.json"));
}

export async function add(components: string[], options: { overwrite: boolean }) {
  const cwd = process.cwd();

  const config = await readConfig(cwd);
  if (!config) {
    log.error("entrepta.json not found. Run `npx entrepta init` first.");
    process.exit(1);
  }

  if (COMPONENTS.length === 0) {
    log.warn("No components available yet. Check back after the registry is populated.");
    return;
  }

  // interactive selection if no args
  let selected: string[] = components;
  if (selected.length === 0) {
    const { picks } = await prompts({
      type: "multiselect",
      name: "picks",
      message: "Select components to add:",
      choices: COMPONENTS.map((c) => ({
        title: `${c.name}  — ${c.description}`,
        value: c.name,
      })),
    });
    if (!picks || picks.length === 0) {
      log.warn("No components selected.");
      return;
    }
    selected = picks as string[];
  }

  // resolve dependencies (including transitive)
  const toInstall = resolveComponents(selected);

  const registryRoot = getRegistryRoot();
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
      const destRelative = path.join(
        config.aliases.components.replace("@/", ""),
        path.basename(file)
      );
      const dest = path.join(cwd, destRelative);

      await fs.mkdir(path.dirname(dest), { recursive: true });

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
      content = rewriteImports(content, config.aliases.utils);
      await fs.writeFile(dest, content, "utf-8");
      log.success(`Copied ${destRelative}`);
    }

    allNpmDeps.push(...component.deps);
  }

  // install npm deps
  const uniqueDeps = [...new Set(allNpmDeps)];
  if (uniqueDeps.length > 0) {
    log.step("Installing dependencies...");
    const pm = await detectPackageManager(cwd);
    await installDeps(uniqueDeps, cwd, pm);
    log.success("Dependencies installed.");
  }

  log.success(`\nAdded: ${toInstall.join(", ")}`);
}

function resolveComponents(names: string[]): string[] {
  const resolved = new Set<string>();

  function resolve(name: string) {
    if (resolved.has(name)) return;
    const component = COMPONENTS.find((c) => c.name === name);
    if (!component) return;
    for (const dep of component.registryDeps) {
      resolve(dep);
    }
    resolved.add(name);
  }

  for (const name of names) {
    resolve(name);
  }

  return [...resolved];
}

function rewriteImports(content: string, utilsAlias: string): string {
  return content.replace(/from\s+["'](\.\.[/\\])*lib[/\\]utils["']/g, `from "${utilsAlias}"`);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
