import fs from "node:fs/promises";
import path from "node:path";

export interface Framework {
  name: string;
  cssPath: string;
  componentsPath: string;
  utilsPath: string;
}

export async function detectFramework(cwd: string): Promise<Framework> {
  const hasNextConfig = await anyExists(cwd, [
    "next.config.js",
    "next.config.ts",
    "next.config.mjs",
    "next.config.cjs",
  ]);

  if (hasNextConfig) {
    const hasAppDir = await dirExists(path.join(cwd, "app"));
    if (hasAppDir) {
      return {
        name: "Next.js (App Router)",
        cssPath: "app/globals.css",
        componentsPath: "components/entrepta",
        utilsPath: "lib/utils.ts",
      };
    }
    return {
      name: "Next.js (Pages Router)",
      cssPath: "styles/globals.css",
      componentsPath: "components/entrepta",
      utilsPath: "lib/utils.ts",
    };
  }

  const hasViteConfig = await anyExists(cwd, [
    "vite.config.js",
    "vite.config.ts",
    "vite.config.mjs",
  ]);

  if (hasViteConfig) {
    return {
      name: "Vite",
      cssPath: "src/index.css",
      componentsPath: "src/components/entrepta",
      utilsPath: "src/lib/utils.ts",
    };
  }

  return {
    name: "Generic",
    cssPath: "src/globals.css",
    componentsPath: "src/components/entrepta",
    utilsPath: "src/lib/utils.ts",
  };
}

async function anyExists(cwd: string, files: string[]): Promise<boolean> {
  for (const file of files) {
    try {
      await fs.access(path.join(cwd, file));
      return true;
    } catch {
      // continue
    }
  }
  return false;
}

async function dirExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}
