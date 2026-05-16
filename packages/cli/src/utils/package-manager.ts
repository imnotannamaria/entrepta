import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

export type PackageManager = "pnpm" | "yarn" | "bun" | "npm";

export async function detectPackageManager(cwd: string): Promise<PackageManager> {
  if (await fileExists(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (await fileExists(path.join(cwd, "yarn.lock"))) return "yarn";
  if (await fileExists(path.join(cwd, "bun.lockb"))) return "bun";
  return "npm";
}

export function installDeps(deps: string[], cwd: string, pm: PackageManager): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = pm === "npm" ? ["install", ...deps] : ["add", ...deps];
    // shell: false (default) so package names are not interpreted by the shell.
    const proc = spawn(pm, args, { cwd, stdio: "inherit" });
    proc.on("error", (err) => reject(err));
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${pm} ${args[0]} failed with exit code ${code}`));
    });
  });
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
