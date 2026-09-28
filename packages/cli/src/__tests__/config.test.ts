import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs/promises", () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn().mockResolvedValue(undefined),
    realpath: vi.fn(async (p: string) => p),
    lstat: vi.fn(),
  },
}));

import fs from "node:fs/promises";
import {
  ConfigError,
  type EntryptaConfig,
  aliasToPath,
  configProblems,
  readConfig,
  writeConfig,
} from "../utils/config.js";

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

  it("throws a ConfigError on broken JSON instead of acting as if there were no file", async () => {
    mockReadFile.mockResolvedValueOnce("{ not json" as never);
    await expect(readConfig("/fake")).rejects.toBeInstanceOf(ConfigError);
  });

  it("refuses an alias that would inject code into an import line", async () => {
    const evil = {
      ...MOCK_CONFIG,
      aliases: { ...MOCK_CONFIG.aliases, lib: '@/lib"; import "evil' },
    };
    mockReadFile.mockResolvedValueOnce(JSON.stringify(evil) as never);
    await expect(readConfig("/fake")).rejects.toThrow(/aliases\.lib/);
  });
});

describe("configProblems", () => {
  it("accepts the config init writes, with and without srcDir", () => {
    expect(configProblems(MOCK_CONFIG)).toEqual([]);
    expect(configProblems({ ...MOCK_CONFIG, srcDir: "src", themes: "all" })).toEqual([]);
    expect(configProblems({ ...MOCK_CONFIG, srcDir: "" })).toEqual([]);
  });

  it("rejects a srcDir that leaves the project or is not a plain folder", () => {
    expect(configProblems({ ...MOCK_CONFIG, srcDir: "../../etc" })).toHaveLength(1);
    expect(configProblems({ ...MOCK_CONFIG, srcDir: "src\nrm" })).toHaveLength(1);
  });

  it("rejects missing aliases, a bad themes value and a non-object", () => {
    expect(configProblems({ ...MOCK_CONFIG, aliases: undefined })).toContain(
      '"aliases" is missing'
    );
    expect(configProblems({ ...MOCK_CONFIG, themes: "some" })).toHaveLength(1);
    expect(configProblems(null)).toEqual(["it is not a JSON object"]);
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
