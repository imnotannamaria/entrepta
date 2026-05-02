import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs/promises", () => ({
  default: {
    access: vi.fn(),
  },
}));

import fs from "node:fs/promises";
import { detectPackageManager } from "../utils/package-manager.js";

const mockAccess = vi.mocked(fs.access);

beforeEach(() => {
  mockAccess.mockRejectedValue(new Error("not found"));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("detectPackageManager", () => {
  it("detects pnpm when pnpm-lock.yaml exists", async () => {
    mockAccess.mockImplementation(async (p) => {
      if (String(p).endsWith("pnpm-lock.yaml")) return;
      throw new Error("not found");
    });
    expect(await detectPackageManager("/fake")).toBe("pnpm");
  });

  it("detects yarn when yarn.lock exists", async () => {
    mockAccess.mockImplementation(async (p) => {
      if (String(p).endsWith("yarn.lock")) return;
      throw new Error("not found");
    });
    expect(await detectPackageManager("/fake")).toBe("yarn");
  });

  it("detects bun when bun.lockb exists", async () => {
    mockAccess.mockImplementation(async (p) => {
      if (String(p).endsWith("bun.lockb")) return;
      throw new Error("not found");
    });
    expect(await detectPackageManager("/fake")).toBe("bun");
  });

  it("falls back to npm when no lockfile found", async () => {
    expect(await detectPackageManager("/fake")).toBe("npm");
  });

  it("prefers pnpm over yarn when both lockfiles exist", async () => {
    mockAccess.mockResolvedValue(undefined as never);
    expect(await detectPackageManager("/fake")).toBe("pnpm");
  });
});
