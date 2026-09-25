import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { COMPONENTS } from "../registry/components.js";
import type { RegistryComponent } from "../registry/types.js";

const REGISTRY_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "registry"
);

function listRegistryFiles(): string[] {
  const dirs: RegistryComponent["category"][] = [
    "primitives",
    "layout",
    "content",
    "feedback",
    "motion",
    "hooks",
    "lib",
  ];
  const out: string[] = [];
  for (const dir of dirs) {
    const full = path.join(REGISTRY_ROOT, dir);
    if (!fs.existsSync(full)) continue;
    for (const entry of fs.readdirSync(full)) {
      if (entry.endsWith(".test.tsx") || entry.endsWith(".test.ts")) continue;
      // init writes lib/utils.ts; it is not something to add
      if (dir === "lib" && entry === "utils.ts") continue;
      if (!entry.endsWith(".tsx") && !entry.endsWith(".ts")) continue;
      out.push(`${dir}/${entry}`);
    }
  }
  return out;
}

const VALID_CATEGORIES: RegistryComponent["category"][] = [
  "primitives",
  "layout",
  "content",
  "feedback",
  "motion",
  "hooks",
  "lib",
];

describe("COMPONENTS registry", () => {
  it("has at least one component", () => {
    expect(COMPONENTS.length).toBeGreaterThan(0);
  });

  it("all entries have required string fields", () => {
    for (const c of COMPONENTS) {
      expect(typeof c.name, `${c.name}.name`).toBe("string");
      expect(c.name.length, `${c.name}.name is empty`).toBeGreaterThan(0);
      expect(typeof c.description, `${c.name}.description`).toBe("string");
      expect(c.description.length, `${c.name}.description is empty`).toBeGreaterThan(0);
    }
  });

  it("all entries have valid category", () => {
    for (const c of COMPONENTS) {
      expect(VALID_CATEGORIES, `${c.name} has invalid category`).toContain(c.category);
    }
  });

  it("all entries have non-empty files array", () => {
    for (const c of COMPONENTS) {
      expect(Array.isArray(c.files), `${c.name}.files is not an array`).toBe(true);
      expect(c.files.length, `${c.name}.files is empty`).toBeGreaterThan(0);
    }
  });

  it("all file paths use forward slashes and end in .tsx or .ts", () => {
    for (const c of COMPONENTS) {
      for (const file of c.files) {
        expect(file, `${c.name}: file "${file}" uses backslash`).not.toContain("\\");
        expect(file, `${c.name}: file "${file}" wrong extension`).toMatch(/\.(tsx|ts)$/);
      }
    }
  });

  it("all entries have deps and registryDeps arrays", () => {
    for (const c of COMPONENTS) {
      expect(Array.isArray(c.deps), `${c.name}.deps`).toBe(true);
      expect(Array.isArray(c.registryDeps), `${c.name}.registryDeps`).toBe(true);
    }
  });

  it("has no duplicate component names", () => {
    const names = COMPONENTS.map((c) => c.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  it("all registryDeps reference existing component names", () => {
    const names = new Set(COMPONENTS.map((c) => c.name));
    for (const c of COMPONENTS) {
      for (const dep of c.registryDeps) {
        expect(names.has(dep), `${c.name}: registryDep "${dep}" does not exist`).toBe(true);
      }
    }
  });

  it("command-palette depends on use-command-palette", () => {
    const palette = COMPONENTS.find((c) => c.name === "command-palette");
    expect(palette).toBeDefined();
    expect(palette?.registryDeps).toContain("use-command-palette");
  });

  it("use-command-palette has category hooks", () => {
    const hook = COMPONENTS.find((c) => c.name === "use-command-palette");
    expect(hook).toBeDefined();
    expect(hook?.category).toBe("hooks");
  });

  it("button has no registryDeps", () => {
    const button = COMPONENTS.find((c) => c.name === "button");
    expect(button?.registryDeps).toEqual([]);
  });

  it("all primitives components include class-variance-authority in deps", () => {
    const withCva = ["button", "badge", "input", "card"];
    for (const name of withCva) {
      const c = COMPONENTS.find((c) => c.name === name);
      expect(c?.deps, `${name} missing cva dep`).toContain("class-variance-authority");
    }
  });

  it("every source file in the registry has a matching COMPONENTS entry", () => {
    const filesOnDisk = listRegistryFiles();
    const filesRegistered = new Set(COMPONENTS.flatMap((c) => c.files));
    const missing = filesOnDisk.filter((f) => !filesRegistered.has(f));
    expect(missing, `Files on disk but not in COMPONENTS: ${missing.join(", ")}`).toEqual([]);
  });

  it("every COMPONENTS file path exists on disk", () => {
    for (const c of COMPONENTS) {
      for (const file of c.files) {
        const full = path.join(REGISTRY_ROOT, file);
        expect(fs.existsSync(full), `${c.name}: missing file ${file}`).toBe(true);
      }
    }
  });

  /**
   * The CLI copies a component's files into one folder and rewrites relative
   * imports. A file it imports from another folder only arrives if the
   * component lists its owner in registryDeps.
   */
  it("covers every import across registry folders with registryDeps", () => {
    const owner = new Map(COMPONENTS.flatMap((c) => c.files.map((f) => [f, c.name] as const)));
    // the CLI resolves registryDeps transitively, so a dep of a dep counts
    const closure = (name: string, seen = new Set<string>()): Set<string> => {
      for (const dep of COMPONENTS.find((c) => c.name === name)?.registryDeps ?? []) {
        if (!seen.has(dep)) {
          seen.add(dep);
          closure(dep, seen);
        }
      }
      return seen;
    };
    const missing: string[] = [];
    for (const c of COMPONENTS) {
      for (const file of c.files) {
        const source = fs.readFileSync(path.join(REGISTRY_ROOT, file), "utf8");
        for (const [, dir, name] of source.matchAll(/from\s+["']\.\.\/([a-z]+)\/([\w-]+)["']/g)) {
          if (dir === "lib" && name === "utils") continue;
          const target = [...owner.keys()].find(
            (f) => f.replace(/\.tsx?$/, "") === `${dir}/${name}`
          );
          const dep = target ? owner.get(target) : undefined;
          if (!dep || !closure(c.name).has(dep)) missing.push(`${c.name} imports ${dir}/${name}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("lists every npm package a component imports in its deps", () => {
    const missing: string[] = [];
    for (const c of COMPONENTS) {
      for (const file of c.files) {
        const source = fs.readFileSync(path.join(REGISTRY_ROOT, file), "utf8");
        for (const [, spec] of source.matchAll(/from\s+["']([^."'][^"']*)["']/g)) {
          const pkg = spec.startsWith("@")
            ? spec.split("/").slice(0, 2).join("/")
            : spec.split("/")[0];
          if (pkg === "react" || pkg === "react-dom") continue;
          if (!c.deps.includes(pkg)) missing.push(`${c.name}: ${pkg}`);
        }
      }
    }
    expect([...new Set(missing)]).toEqual([]);
  });
});
