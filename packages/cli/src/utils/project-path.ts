import fs from "node:fs/promises";
import path from "node:path";

export class OutsideProjectError extends Error {}

function isInside(root: string, target: string): boolean {
  const rel = path.relative(root, target);
  return rel === "" || (rel !== ".." && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel));
}

/**
 * Where a write to `target` really lands. The deepest part of the path that
 * exists is resolved through its symlinks, and the missing rest is joined back
 * on, since it will be created as plain folders.
 */
async function realTarget(target: string): Promise<string> {
  const missing: string[] = [];
  let existing = target;
  for (;;) {
    try {
      return path.join(await fs.realpath(existing), ...missing);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      // realpath fails on a dangling symlink too, and writing through one creates
      // its target wherever it points. It is there, so it cannot be treated as missing.
      const isEntry = await fs.lstat(existing).then(
        () => true,
        () => false
      );
      if (isEntry) {
        throw new OutsideProjectError(`${existing} is a symlink to a path that does not exist.`);
      }
      const parent = path.dirname(existing);
      if (parent === existing) return target;
      missing.unshift(path.basename(existing));
      existing = parent;
    }
  }
}

/**
 * Throws unless a write to `target` stays inside `cwd`. Checks the path as
 * written and then as the filesystem resolves it, so neither `..` in an alias
 * nor a symlinked folder from a cloned repo can send a write elsewhere.
 */
export async function assertInsideProject(cwd: string, target: string): Promise<void> {
  const absolute = path.resolve(cwd, target);
  if (!isInside(path.resolve(cwd), absolute)) {
    throw new OutsideProjectError(`${target} resolves outside ${cwd}.`);
  }
  const root = await fs.realpath(cwd);
  const real = await realTarget(absolute);
  if (!isInside(root, real)) {
    throw new OutsideProjectError(`${target} is a symlink to ${real}, outside ${cwd}.`);
  }
}

/** Writes a file inside the project, creating its folders. Refuses any path that leaves it. */
export async function writeProjectFile(cwd: string, target: string, content: string) {
  await assertInsideProject(cwd, target);
  const absolute = path.resolve(cwd, target);
  await fs.mkdir(path.dirname(absolute), { recursive: true });
  await fs.writeFile(absolute, content, "utf-8");
}
