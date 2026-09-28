import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  OutsideProjectError,
  assertInsideProject,
  writeProjectFile,
} from "../utils/project-path.js";

// A real folder with real symlinks: the check is about what the filesystem does.
let base: string;
let project: string;
let elsewhere: string;

beforeEach(async () => {
  base = await fs.mkdtemp(path.join(os.tmpdir(), "entrepta-cli-"));
  project = path.join(base, "project");
  elsewhere = path.join(base, "elsewhere");
  await fs.mkdir(project);
  await fs.mkdir(elsewhere);
});

afterEach(async () => {
  await fs.rm(base, { recursive: true, force: true });
});

describe("writeProjectFile", () => {
  it("writes inside the project and creates the folders on the way", async () => {
    await writeProjectFile(project, "components/entrepta/button.tsx", "button");
    const written = await fs.readFile(path.join(project, "components/entrepta/button.tsx"), "utf8");
    expect(written).toBe("button");
  });

  it("refuses a path that climbs out with ..", async () => {
    await expect(writeProjectFile(project, "../elsewhere/button.tsx", "x")).rejects.toThrow(
      OutsideProjectError
    );
    await expect(fs.readdir(elsewhere)).resolves.toEqual([]);
  });

  it("refuses a folder that is a symlink to somewhere else", async () => {
    await fs.mkdir(path.join(project, "components"));
    await fs.symlink(elsewhere, path.join(project, "components/entrepta"));
    await expect(writeProjectFile(project, "components/entrepta/button.tsx", "x")).rejects.toThrow(
      OutsideProjectError
    );
    await expect(fs.readdir(elsewhere)).resolves.toEqual([]);
  });

  it("refuses a file that is a symlink to somewhere else, even with overwrite in mind", async () => {
    const victim = path.join(elsewhere, "utils.ts");
    await fs.writeFile(victim, "theirs");
    await fs.mkdir(path.join(project, "lib"));
    await fs.symlink(victim, path.join(project, "lib/utils.ts"));
    await expect(writeProjectFile(project, "lib/utils.ts", "ours")).rejects.toThrow(
      OutsideProjectError
    );
    await expect(fs.readFile(victim, "utf8")).resolves.toBe("theirs");
  });

  it("refuses a dangling symlink, which a write would follow and create", async () => {
    await fs.symlink(path.join(elsewhere, "new.css"), path.join(project, "globals.css"));
    await expect(writeProjectFile(project, "globals.css", "x")).rejects.toThrow(
      OutsideProjectError
    );
    await expect(fs.readdir(elsewhere)).resolves.toEqual([]);
  });

  it("allows a symlink that stays inside the project", async () => {
    await fs.mkdir(path.join(project, "src/components"), { recursive: true });
    await fs.symlink(path.join(project, "src/components"), path.join(project, "components"));
    await writeProjectFile(project, "components/button.tsx", "button");
    const written = await fs.readFile(path.join(project, "src/components/button.tsx"), "utf8");
    expect(written).toBe("button");
  });

  it("allows a folder whose name only starts with two dots", async () => {
    await writeProjectFile(project, "..cache/button.tsx", "button");
    await expect(fs.readFile(path.join(project, "..cache/button.tsx"), "utf8")).resolves.toBe(
      "button"
    );
  });

  it("works when the project itself is reached through a symlink", async () => {
    const link = path.join(base, "link-to-project");
    await fs.symlink(project, link);
    await expect(assertInsideProject(link, "app/globals.css")).resolves.toBeUndefined();
  });
});
