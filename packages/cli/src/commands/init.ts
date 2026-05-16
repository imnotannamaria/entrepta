import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import prompts from "prompts";
import { writeConfig } from "../utils/config.js";
import { detectFramework } from "../utils/detect-framework.js";
import { log } from "../utils/logger.js";
import { detectPackageManager, installDeps } from "../utils/package-manager.js";

const THEMES = ["entrepta", "blossom", "marmalade", "julia", "ivy", "bosco"] as const;
type Theme = (typeof THEMES)[number];

const require = createRequire(import.meta.url);

function getRegistryRoot(): string {
  return path.dirname(require.resolve("@entrepta/registry/package.json"));
}

export async function init(options: { theme?: string; overwrite: boolean }) {
  const cwd = process.cwd();

  log.step("Detecting framework...");
  const framework = await detectFramework(cwd);
  log.info(`Framework: ${framework.name}`);

  // resolve theme
  let theme: Theme;
  if (options.theme && THEMES.includes(options.theme as Theme)) {
    theme = options.theme as Theme;
  } else {
    const answer = await prompts({
      type: "select",
      name: "theme",
      message: "Choose a theme:",
      choices: [
        { title: "entrepta   — violet, IDE personality (default)", value: "entrepta" },
        { title: "blossom    — cherry red, bold and confident", value: "blossom" },
        { title: "marmalade  — warm orange, editorial and energetic", value: "marmalade" },
        { title: "julia      — warm pink, soft and expressive", value: "julia" },
        { title: "ivy        — forest green, calm and grounded", value: "ivy" },
        { title: "bosco      — deep blue, technical and steady", value: "bosco" },
      ],
      initial: 0,
    });
    if (!answer.theme) {
      log.error("No theme selected. Aborting.");
      process.exit(1);
    }
    theme = answer.theme as Theme;
  }

  // write entrepta.json
  const config = {
    $schema: "https://entrepta.dev/schema.json",
    theme,
    tsx: true,
    rsc: true,
    tailwind: {
      css: framework.cssPath,
      baseColor: "zinc",
    },
    aliases: {
      components: `@/${framework.componentsPath}`,
      lib: "@/lib",
      utils: "@/lib/utils",
      hooks: "@/hooks",
    },
  };

  const configPath = path.join(cwd, "entrepta.json");
  const configExists = await fileExists(configPath);
  if (configExists && !options.overwrite) {
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: "entrepta.json already exists. Overwrite?",
      initial: false,
    });
    if (!confirm) {
      log.warn("Skipped entrepta.json.");
    } else {
      await writeConfig(cwd, config);
      log.success("Updated entrepta.json");
    }
  } else {
    await writeConfig(cwd, config);
    log.success("Created entrepta.json");
  }

  // write globals.css
  const registryRoot = getRegistryRoot();
  const globalsCssContent = await fs.readFile(
    path.join(registryRoot, "styles", "globals.css"),
    "utf-8"
  );
  const themeCssContent = await fs.readFile(
    path.join(registryRoot, "styles", "themes", `${theme}.css`),
    "utf-8"
  );
  const cssOutput = `${globalsCssContent}\n/* theme */\n${themeCssContent}`;

  const cssPath = path.join(cwd, framework.cssPath);
  await ensureDir(path.dirname(cssPath));
  const cssExists = await fileExists(cssPath);
  if (cssExists && !options.overwrite) {
    const { confirm } = await prompts({
      type: "confirm",
      name: "confirm",
      message: `${framework.cssPath} already exists. Overwrite?`,
      initial: false,
    });
    if (!confirm) {
      log.warn(`Skipped ${framework.cssPath}.`);
    } else {
      await fs.writeFile(cssPath, cssOutput, "utf-8");
      log.success(`Updated ${framework.cssPath}`);
    }
  } else {
    await fs.writeFile(cssPath, cssOutput, "utf-8");
    log.success(`Created ${framework.cssPath}`);
  }

  // write lib/utils.ts
  const utilsPath = path.join(cwd, framework.utilsPath);
  await ensureDir(path.dirname(utilsPath));
  const utilsExists = await fileExists(utilsPath);
  const utilsContent = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
  if (utilsExists && !options.overwrite) {
    log.warn(`Skipped ${framework.utilsPath} (already exists).`);
  } else {
    await fs.writeFile(utilsPath, utilsContent, "utf-8");
    log.success(`Created ${framework.utilsPath}`);
  }

  // install peer deps
  log.step("Installing dependencies...");
  const pm = await detectPackageManager(cwd);
  await installDeps(["clsx", "tailwind-merge", "class-variance-authority"], cwd, pm);
  log.success("Dependencies installed.");

  log.success(`\nentrepta initialized with theme: ${theme}`);
  log.info(`Run "npx entrepta add <component>" to add components.`);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}
