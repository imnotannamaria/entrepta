import { COMPONENTS, type RegistryComponent } from "@entrepta/registry/manifest";

export { COMPONENTS };
export type { RegistryComponent };

export function findComponent(name: string): RegistryComponent | undefined {
  return COMPONENTS.find((c) => c.name === name);
}

/**
 * The item and everything its registryDeps pull in, dependencies first: the
 * same set `entrepta add <name>` copies.
 */
export function installClosure(name: string): RegistryComponent[] {
  const out: RegistryComponent[] = [];
  const seen = new Set<string>();
  const visit = (n: string) => {
    if (seen.has(n)) return;
    seen.add(n);
    const c = findComponent(n);
    if (!c) return;
    for (const dep of c.registryDeps) visit(dep);
    out.push(c);
  };
  visit(name);
  return out;
}

/** Registry files to copy for `name`, its own first. */
export function filesFor(name: string): string[] {
  const closure = installClosure(name);
  const own = closure.at(-1)?.files ?? [];
  return [...own, ...closure.slice(0, -1).flatMap((c) => c.files)];
}

/** npm packages to install for `name`, deduplicated. */
export function depsFor(name: string): string[] {
  return [...new Set(installClosure(name).flatMap((c) => c.deps))];
}

/**
 * Components with no page of their own. They arrive as a dependency of the ones
 * that use them, and are described there: Diamond is the ◆ inside Card, Dialog,
 * Field and Tabs.
 */
export const NO_PAGE = new Set(["diamond"]);

/** Items a user picks. Hooks, lib files and NO_PAGE items arrive as dependencies. */
export const PICKABLE = COMPONENTS.filter(
  (c) => c.category !== "hooks" && c.category !== "lib" && !NO_PAGE.has(c.name)
);
