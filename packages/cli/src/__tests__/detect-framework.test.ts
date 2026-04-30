import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// mock node:fs/promises before importing the module
vi.mock("node:fs/promises", () => ({
  default: {
    access: vi.fn(),
    stat: vi.fn(),
  },
}));

import fs from "node:fs/promises";
import { detectFramework } from "../utils/detect-framework.js";

const mockAccess = vi.mocked(fs.access);
const mockStat = vi.mocked(fs.stat);

beforeEach(() => {
  mockAccess.mockRejectedValue(new Error("not found"));
  mockStat.mockRejectedValue(new Error("not found"));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("detectFramework", () => {
  it("detects Next.js App Router when next.config.ts and app/ dir exist", async () => {
    mockAccess.mockImplementation(async (p) => {
      if (String(p).endsWith("next.config.ts")) return;
      throw new Error("not found");
    });
    mockStat.mockImplementation(async (p) => {
      if (String(p).endsWith("/app"))
        return { isDirectory: () => true } as ReturnType<typeof fs.stat> extends Promise<infer T>
          ? T
          : never;
      throw new Error("not found");
    });

    const result = await detectFramework("/fake/project");
    expect(result.name).toBe("Next.js (App Router)");
    expect(result.cssPath).toBe("app/globals.css");
    expect(result.utilsPath).toBe("lib/utils.ts");
  });

  it("detects Next.js Pages Router when next.config.ts exists but no app/ dir", async () => {
    mockAccess.mockImplementation(async (p) => {
      if (String(p).endsWith("next.config.ts")) return;
      throw new Error("not found");
    });

    const result = await detectFramework("/fake/project");
    expect(result.name).toBe("Next.js (Pages Router)");
    expect(result.cssPath).toBe("styles/globals.css");
  });

  it("detects Vite when vite.config.ts exists", async () => {
    mockAccess.mockImplementation(async (p) => {
      if (String(p).endsWith("vite.config.ts")) return;
      throw new Error("not found");
    });

    const result = await detectFramework("/fake/project");
    expect(result.name).toBe("Vite");
    expect(result.cssPath).toBe("src/index.css");
  });

  it("falls back to Generic when no config files exist", async () => {
    const result = await detectFramework("/fake/project");
    expect(result.name).toBe("Generic");
  });
});
