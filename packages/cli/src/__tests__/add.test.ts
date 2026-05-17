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
  readConfig: vi.fn(),
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
import { add } from "../commands/add.js";
import { readConfig } from "../utils/config.js";
import { log } from "../utils/logger.js";
import { installDeps } from "../utils/package-manager.js";

const mockReadFile = vi.mocked(fs.readFile);
const mockWriteFile = vi.mocked(fs.writeFile);
const mockAccess = vi.mocked(fs.access);
const mockPrompts = vi.mocked(prompts);
const mockReadConfig = vi.mocked(readConfig);
const mockInstallDeps = vi.mocked(installDeps);

const MOCK_CONFIG = {
  $schema: "https://entrepta.vercel.app/schema.json",
  theme: "entrepta" as const,
  tsx: true,
  rsc: true,
  tailwind: { css: "app/globals.css", baseColor: "zinc" },
  aliases: {
    components: "@/components/entrepta",
    lib: "@/lib",
    utils: "@/lib/utils",
    hooks: "@/hooks",
  },
};

const BUTTON_SOURCE = `import { cn } from "../lib/utils"\nexport function Button() {}\n`;

let exitSpy: { mockRestore: () => void };

beforeEach(() => {
  vi.clearAllMocks();
  mockAccess.mockRejectedValue(new Error("not found"));
  mockReadFile.mockResolvedValue(BUTTON_SOURCE as never);
  mockWriteFile.mockResolvedValue(undefined as never);
  exitSpy = vi.spyOn(process, "exit").mockImplementation((code) => {
    throw new Error(`exit:${code}`);
  });
  vi.spyOn(process, "cwd").mockReturnValue("/fake/project");
});

afterEach(() => {
  exitSpy.mockRestore();
});

describe("add", () => {
  describe("no config", () => {
    it("exits with code 1 when entrepta.json not found", async () => {
      mockReadConfig.mockResolvedValue(null);
      await expect(add(["button"], { overwrite: false })).rejects.toThrow("exit:1");
      expect(log.error).toHaveBeenCalledWith(expect.stringContaining("entrepta.json not found"));
    });
  });

  describe("happy path", () => {
    beforeEach(() => {
      mockReadConfig.mockResolvedValue(MOCK_CONFIG);
    });

    it("copies component file to correct destination", async () => {
      await add(["button"], { overwrite: false });
      expect(mockWriteFile).toHaveBeenCalledWith(
        expect.stringContaining("components/entrepta/button.tsx"),
        expect.any(String),
        "utf-8"
      );
    });

    it("rewrites relative utils import to configured alias", async () => {
      await add(["button"], { overwrite: false });
      const [, writtenContent] = mockWriteFile.mock.calls[0];
      expect(String(writtenContent)).toContain("@/lib/utils");
      expect(String(writtenContent)).not.toContain("../lib/utils");
    });

    it("installs npm deps for the component", async () => {
      await add(["button"], { overwrite: false });
      expect(mockInstallDeps).toHaveBeenCalledWith(
        expect.arrayContaining([
          "class-variance-authority",
          "lucide-react",
          "@radix-ui/react-slot",
        ]),
        expect.any(String),
        expect.any(String)
      );
    });

    it("deduplicates npm deps when adding multiple components with shared deps", async () => {
      await add(["button", "badge"], { overwrite: false });
      const [deps] = mockInstallDeps.mock.calls[0];
      const cva = (deps as string[]).filter((d) => d === "class-variance-authority");
      expect(cva.length).toBe(1);
    });

    it("exits with code 1 and lists available components on unknown name", async () => {
      await expect(add(["nonexistent"], { overwrite: false })).rejects.toThrow("exit:1");
      expect(log.error).toHaveBeenCalledWith(expect.stringContaining("nonexistent"));
      expect(mockWriteFile).not.toHaveBeenCalled();
    });
  });

  describe("transitive dependency resolution", () => {
    beforeEach(() => {
      mockReadConfig.mockResolvedValue(MOCK_CONFIG);
    });

    it("installs use-command-palette when adding command-palette", async () => {
      await add(["command-palette"], { overwrite: false });

      const allWritten = mockWriteFile.mock.calls.map(([dest]) => String(dest));
      const hookWritten = allWritten.some((p) => p.includes("use-command-palette"));
      expect(hookWritten).toBe(true);
    });

    it("copies hook to hooks/ dir, not components/ dir", async () => {
      await add(["command-palette"], { overwrite: false });

      const allWritten = mockWriteFile.mock.calls.map(([dest]) => String(dest));
      const hookDest = allWritten.find((p) => p.includes("use-command-palette"));
      expect(hookDest).toContain("hooks/");
    });

    it("does not infinite-loop when resolving cyclic registryDeps", async () => {
      vi.resetModules();
      vi.doMock("../registry/components.js", () => ({
        COMPONENTS: [
          { name: "a", category: "primitives", files: [], deps: [], registryDeps: ["b"] },
          { name: "b", category: "primitives", files: [], deps: [], registryDeps: ["a"] },
        ],
      }));
      const { resolveComponents: cyclicResolve } = await import("../commands/add.js");
      expect(() => cyclicResolve(["a"])).not.toThrow();
      const result = cyclicResolve(["a"]);
      expect(result).toEqual(expect.arrayContaining(["a", "b"]));
      expect(result.length).toBe(2);
      vi.doUnmock("../registry/components.js");
      vi.resetModules();
    });
  });

  describe("overwrite behaviour", () => {
    beforeEach(() => {
      mockReadConfig.mockResolvedValue(MOCK_CONFIG);
      mockAccess.mockResolvedValue(undefined as never);
    });

    it("asks for confirmation when file exists and --overwrite not set", async () => {
      mockPrompts.mockResolvedValueOnce({ confirm: false } as never);
      await add(["button"], { overwrite: false });
      expect(mockPrompts).toHaveBeenCalled();
      expect(mockWriteFile).not.toHaveBeenCalled();
    });

    it("copies file when user confirms overwrite prompt", async () => {
      mockPrompts.mockResolvedValueOnce({ confirm: true } as never);
      await add(["button"], { overwrite: false });
      expect(mockWriteFile).toHaveBeenCalled();
    });

    it("copies without prompting when --overwrite flag is set", async () => {
      await add(["button"], { overwrite: true });
      expect(mockPrompts).not.toHaveBeenCalled();
      expect(mockWriteFile).toHaveBeenCalled();
    });
  });

  describe("interactive mode (no args)", () => {
    beforeEach(() => {
      mockReadConfig.mockResolvedValue(MOCK_CONFIG);
    });

    it("shows multiselect prompt when called with no component names", async () => {
      mockPrompts.mockResolvedValueOnce({ picks: ["button"] } as never);
      await add([], { overwrite: false });
      expect(mockPrompts).toHaveBeenCalledWith(expect.objectContaining({ type: "multiselect" }));
    });

    it("returns early with warning when user selects nothing", async () => {
      mockPrompts.mockResolvedValueOnce({ picks: [] } as never);
      await add([], { overwrite: false });
      expect(log.warn).toHaveBeenCalledWith(expect.stringContaining("No components selected"));
      expect(mockWriteFile).not.toHaveBeenCalled();
    });
  });
});
