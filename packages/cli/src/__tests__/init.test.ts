import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs/promises", () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn().mockResolvedValue(undefined),
    access: vi.fn(),
  },
}));

vi.mock("node:module", () => ({
  createRequire: () =>
    Object.assign(() => {}, {
      resolve: () => "/fake/registry/package.json",
    }),
}));

vi.mock("prompts", () => ({ default: vi.fn() }));

vi.mock("../utils/config.js", () => ({
  writeConfig: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../utils/detect-framework.js", () => ({
  detectFramework: vi.fn().mockResolvedValue({
    name: "Next.js (App Router)",
    cssPath: "app/globals.css",
    utilsPath: "lib/utils.ts",
    componentsPath: "components/entrepta",
  }),
}));

vi.mock("../utils/logger.js", () => ({
  log: { step: vi.fn(), info: vi.fn(), success: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock("../utils/package-manager.js", () => ({
  detectPackageManager: vi.fn().mockResolvedValue("npm"),
  installDeps: vi.fn().mockResolvedValue(undefined),
}));

import fs from "node:fs/promises";
import prompts from "prompts";
import { init } from "../commands/init.js";
import { writeConfig } from "../utils/config.js";
import { log } from "../utils/logger.js";
import { installDeps } from "../utils/package-manager.js";

const mockReadFile = vi.mocked(fs.readFile);
const mockWriteFile = vi.mocked(fs.writeFile);
const mockAccess = vi.mocked(fs.access);
const mockPrompts = vi.mocked(prompts);
const mockWriteConfig = vi.mocked(writeConfig);
const mockInstallDeps = vi.mocked(installDeps);

const GLOBALS_CSS = "/* globals */";
const THEME_CSS = "/* theme */";

let exitSpy: { mockRestore: () => void };

beforeEach(() => {
  vi.clearAllMocks();
  // No files exist by default
  mockAccess.mockRejectedValue(new Error("not found"));
  // Registry CSS files
  mockReadFile.mockImplementation(async (p) => {
    if (String(p).endsWith("globals.css")) return GLOBALS_CSS as never;
    if (String(p).includes("themes/")) return THEME_CSS as never;
    throw new Error(`unexpected readFile: ${p}`);
  });
  mockWriteFile.mockResolvedValue(undefined as never);
  exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`exit:${code}`);
  });
  vi.spyOn(process, "cwd").mockReturnValue("/fake/project");
});

afterEach(() => {
  exitSpy.mockRestore();
});

describe("init", () => {
  describe("theme selection", () => {
    it("uses --theme flag without showing prompt", async () => {
      await init({ theme: "ivy", overwrite: false });
      expect(mockPrompts).not.toHaveBeenCalledWith(expect.objectContaining({ type: "select" }));
    });

    it("writes config with the provided theme", async () => {
      await init({ theme: "marmalade", overwrite: false });
      expect(mockWriteConfig).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ theme: "marmalade" })
      );
    });

    it("shows select prompt when no --theme flag provided", async () => {
      mockPrompts.mockResolvedValueOnce({ theme: "julia" } as never);
      await init({ theme: undefined, overwrite: false });
      expect(mockPrompts).toHaveBeenCalledWith(
        expect.objectContaining({ type: "select", name: "theme" })
      );
    });

    it("exits when prompt is dismissed without selection", async () => {
      mockPrompts.mockResolvedValueOnce({ theme: undefined } as never);
      await expect(init({ theme: undefined, overwrite: false })).rejects.toThrow("exit:1");
      expect(log.error).toHaveBeenCalled();
    });

    it("exits with code 1 when --theme value is not a valid preset", async () => {
      await expect(init({ theme: "invalid-theme", overwrite: false })).rejects.toThrow("exit:1");
      expect(log.error).toHaveBeenCalledWith(expect.stringContaining("Invalid theme"));
      expect(mockPrompts).not.toHaveBeenCalled();
    });
  });

  describe("file generation", () => {
    it("writes globals.css with base + theme concatenated", async () => {
      await init({ theme: "entrepta", overwrite: false });
      const cssCall = mockWriteFile.mock.calls.find(([p]) => String(p).endsWith("globals.css"));
      expect(cssCall).toBeDefined();
      const content = String(cssCall?.[1]);
      expect(content).toContain(GLOBALS_CSS);
      expect(content).toContain(THEME_CSS);
    });

    it("writes lib/utils.ts with cn helper", async () => {
      await init({ theme: "entrepta", overwrite: false });
      const utilsCall = mockWriteFile.mock.calls.find(([p]) => String(p).endsWith("utils.ts"));
      expect(utilsCall).toBeDefined();
      expect(String(utilsCall?.[1])).toContain("twMerge");
      expect(String(utilsCall?.[1])).toContain("clsx");
    });

    it("creates entrepta.json config with correct structure", async () => {
      await init({ theme: "blossom", overwrite: false });
      expect(mockWriteConfig).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          $schema: expect.stringContaining("entrepta.dev"),
          theme: "blossom",
          tsx: true,
          aliases: expect.objectContaining({
            components: expect.any(String),
            utils: expect.any(String),
            hooks: expect.any(String),
          }),
        })
      );
    });

    it("installs clsx, tailwind-merge and class-variance-authority as peer deps", async () => {
      await init({ theme: "entrepta", overwrite: false });
      expect(mockInstallDeps).toHaveBeenCalledWith(
        expect.arrayContaining(["clsx", "tailwind-merge", "class-variance-authority"]),
        expect.any(String),
        expect.any(String)
      );
    });
  });

  describe("overwrite behaviour", () => {
    beforeEach(() => {
      mockAccess.mockResolvedValue(undefined as never);
    });

    it("prompts before overwriting existing entrepta.json", async () => {
      // entrepta.json prompt + globals.css prompt (utils.ts doesn't prompt)
      mockPrompts
        .mockResolvedValueOnce({ confirm: false } as never)
        .mockResolvedValueOnce({ confirm: false } as never);
      await init({ theme: "entrepta", overwrite: false });
      expect(mockPrompts).toHaveBeenCalledWith(expect.objectContaining({ type: "confirm" }));
    });

    it("skips entrepta.json when overwrite prompt is declined", async () => {
      mockPrompts
        .mockResolvedValueOnce({ confirm: false } as never)
        .mockResolvedValueOnce({ confirm: false } as never);
      await init({ theme: "entrepta", overwrite: false });
      expect(mockWriteConfig).not.toHaveBeenCalled();
    });

    it("overwrites all files without prompting when --overwrite flag is set", async () => {
      await init({ theme: "entrepta", overwrite: true });
      expect(mockPrompts).not.toHaveBeenCalled();
      expect(mockWriteConfig).toHaveBeenCalled();
    });
  });
});
