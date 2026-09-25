import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs/promises", () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

import fs from "node:fs/promises";
import { type EntryptaConfig, aliasToPath, readConfig, writeConfig } from "../utils/config.js";

const mockReadFile = vi.mocked(fs.readFile);
const mockWriteFile = vi.mocked(fs.writeFile);

const MOCK_CONFIG: EntryptaConfig = {
  $schema: "https://entrepta.vercel.app/schema.json",
  theme: "entrepta",
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

beforeEach(() => {
  vi.clearAllMocks();
});

describe("readConfig", () => {
  it("returns parsed config when file exists", async () => {
    mockReadFile.mockResolvedValueOnce(JSON.stringify(MOCK_CONFIG) as never);
    const result = await readConfig("/fake");
    expect(result).toEqual(MOCK_CONFIG);
  });

  it("returns null when file does not exist", async () => {
    mockReadFile.mockRejectedValueOnce(new Error("ENOENT") as never);
    const result = await readConfig("/fake");
    expect(result).toBeNull();
  });
});

describe("writeConfig", () => {
  it("writes prettified JSON with trailing newline", async () => {
    mockWriteFile.mockResolvedValueOnce(undefined as never);
    await writeConfig("/fake", MOCK_CONFIG);
    const [, content] = mockWriteFile.mock.calls[0];
    expect(typeof content).toBe("string");
    expect(String(content).endsWith("\n")).toBe(true);
    expect(JSON.parse(String(content))).toEqual(MOCK_CONFIG);
  });
});

describe("aliasToPath", () => {
  it("maps @/ to the project root when there is no srcDir", () => {
    expect(aliasToPath("@/hooks")).toBe("hooks");
    expect(aliasToPath("@/app/components/entrepta")).toBe("app/components/entrepta");
  });

  it("maps @/ into srcDir, as a Vite project does", () => {
    expect(aliasToPath("@/hooks", "src")).toBe("src/hooks");
    expect(aliasToPath("@/components/entrepta", "src")).toBe("src/components/entrepta");
  });

  it("keeps an old config that spelled the folder out", () => {
    expect(aliasToPath("@/src/components/entrepta")).toBe("src/components/entrepta");
  });
});
