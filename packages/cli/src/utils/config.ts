import fs from "node:fs/promises";
import path from "node:path";

export interface EntryptaConfig {
  $schema?: string;
  theme: string;
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
