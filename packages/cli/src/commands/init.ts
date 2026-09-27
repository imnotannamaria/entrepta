import fs from "node:fs/promises";
import path from "node:path";
import prompts from "prompts";
import { type EntryptaConfig, writeConfig } from "../utils/config.js";
import { detectFramework } from "../utils/detect-framework.js";
import { log } from "../utils/logger.js";
import { detectPackageManager, installDeps } from "../utils/package-manager.js";
import { OutsideProjectError, writeProjectFile } from "../utils/project-path.js";
import { getRegistryRoot } from "../utils/registry.js";
import { THEMES, type Theme, type ThemesMode, buildThemesCss } from "../utils/themes-css.js";

const THEMES_MODES = ["single", "all"] as const;

export async function init(options: { theme?: string; themes?: string; overwrite: boolean }) {
  const cwd = process.cwd();

  log.step("Detecting framework...");
  const framework = await detectFramework(cwd);
  log.info(`Framework: ${framework.name}`);

  let themesMode: ThemesMode;
  if (options.themes !== undefined) {
    if (!THEMES_MODES.includes(options.themes as ThemesMode)) {
      log.error(`Invalid --themes "${options.themes}". Use single or all.`);
      process.exit(1);
    }
    themesMode = options.themes as ThemesMode;
  } else if (options.theme !== undefined) {
    // `init --theme=x` stays non-interactive, as it was before --themes existed.
    themesMode = "single";
  } else {
    const answer = await prompts({
      type: "select",
      name: "themes",
      message: "How should themes work?",
      choices: [
        { title: "One fixed theme", value: "single" },
        { title: "All six, switchable at runtime", value: "all" },
      ],
      initial: 0,
    });
    if (!answer.themes) {
      log.error("No option selected. Aborting.");
      process.exit(1);
    }
    themesMode = answer.themes as ThemesMode;
  }

  let theme: Theme;
  if (options.theme !== undefined) {
    if (!THEMES.includes(options.theme as Theme)) {
      log.error(`Invalid theme "${options.theme}". Available: ${THEMES.join(", ")}.`);
      process.exit(1);
    }
    theme = options.theme as Theme;
  } else {
    const answer = await prompts({
      type: "select",
      name: "theme",
      message: themesMode === "all" ? "Choose the default theme:" : "Choose a theme:",
      choices: [
        { title: "entrepta   violet, IDE personality (default)", value: "entrepta" },
        { title: "blossom    cherry red, bold and confident", value: "blossom" },
        { title: "marmalade  warm orange, editorial and energetic", value: "marmalade" },
        { title: "julia      warm pink, soft and expressive", value: "julia" },
        { title: "ivy        forest green, calm and grounded", value: "ivy" },
        { title: "bosco      deep blue, technical and steady", value: "bosco" },
      ],
      initial: 0,
    });
    if (!answer.theme) {
      log.error("No theme selected. Aborting.");
      process.exit(1);
    }
    theme = answer.theme as Theme;
  }

  const config: EntryptaConfig = {
    $schema: "https://entrepta.vercel.app/schema.json",
    theme,
    themes: themesMode,
    tsx: true,
    rsc: true,
    tailwind: {
      css: framework.cssPath,
      baseColor: "zinc",
    },
    ...(framework.srcDir ? { srcDir: framework.srcDir } : {}),
    aliases: {
      // aliases are relative to srcDir, which is where `@/` points
      components: `@/${path.posix.relative(framework.srcDir, framework.componentsPath)}`,
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
      await guard(() => writeConfig(cwd, config));
      log.success("Updated entrepta.json");
    }
  } else {
    await guard(() => writeConfig(cwd, config));
    log.success("Created entrepta.json");
  }

  let registryRoot: string;
  try {
    registryRoot = getRegistryRoot();
  } catch (err) {
    log.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
  const globalsCssContent = await fs.readFile(
    path.join(registryRoot, "styles", "globals.css"),
    "utf-8"
  );
  const readTheme = (id: Theme) =>
    fs.readFile(path.join(registryRoot, "styles", "themes", `${id}.css`), "utf-8");
  let cssOutput: string;
  if (themesMode === "all") {
    const files = Object.fromEntries(
      await Promise.all(THEMES.map(async (id) => [id, await readTheme(id)] as const))
    ) as Record<Theme, string>;
    cssOutput = `${globalsCssContent}\n/* themes, switch with data-theme on <html> */\n${buildThemesCss(files, theme)}\n`;
  } else {
    cssOutput = `${globalsCssContent}\n/* theme */\n${await readTheme(theme)}`;
  }

  const cssPath = path.join(cwd, framework.cssPath);
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
      await guard(() => writeProjectFile(cwd, framework.cssPath, cssOutput));
      log.success(`Updated ${framework.cssPath}`);
    }
  } else {
    await guard(() => writeProjectFile(cwd, framework.cssPath, cssOutput));
    log.success(`Created ${framework.cssPath}`);
  }

  const utilsPath = path.join(cwd, framework.utilsPath);
  const utilsExists = await fileExists(utilsPath);
  const utilsContent = await fs.readFile(path.join(registryRoot, "lib", "utils.ts"), "utf-8");
  if (utilsExists && !options.overwrite) {
    log.warn(`Skipped ${framework.utilsPath} (already exists).`);
  } else {
    await guard(() => writeProjectFile(cwd, framework.utilsPath, utilsContent));
    log.success(`Created ${framework.utilsPath}`);
  }

  log.step("Installing dependencies...");
  const pm = await detectPackageManager(cwd);
  try {
    await installDeps(["clsx", "tailwind-merge", "class-variance-authority"], cwd, pm);
    log.success("Dependencies installed.");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.error(`Failed to install dependencies: ${message}`);
    log.info(`Install them manually: ${pm} add clsx tailwind-merge class-variance-authority`);
    process.exit(1);
  }

  if (themesMode === "all") {
    log.success(`\nentrepta initialized with all six themes. Default: ${theme}`);
    log.info('Switch with data-theme on <html>, or add the switcher: "add theme-switcher".');
  } else {
    log.success(`\nentrepta initialized with theme: ${theme}`);
  }
  log.info(`Run "npx @entrepta/cli@latest add <component>" to add components.`);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/** A symlinked app/ or lib/ in a cloned repo would send a write elsewhere. */
async function guard(write: () => Promise<void>): Promise<void> {
  try {
    await write();
  } catch (error) {
    if (!(error instanceof OutsideProjectError)) throw error;
    log.error(`Refusing to write outside the project: ${error.message}`);
    process.exit(1);
  }
}
