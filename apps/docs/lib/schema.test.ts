import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { THEMES } from "./theme";

/**
 * Every entrepta.json the CLI writes points its $schema at this file, so it has
 * to exist and agree with the CLI's own rules.
 */

const schema = JSON.parse(fs.readFileSync(path.join(__dirname, "../public/schema.json"), "utf8"));
const cliConfig = fs.readFileSync(
  path.join(__dirname, "../../../packages/cli/src/utils/config.ts"),
  "utf8"
);
const cliInit = fs.readFileSync(
  path.join(__dirname, "../../../packages/cli/src/commands/init.ts"),
  "utf8"
);

describe("schema.json", () => {
  it("is the URL init writes", () => {
    expect(cliInit).toContain(`$schema: "${schema.$id}"`);
  });

  it("lists every theme", () => {
    expect(schema.properties.theme.enum).toEqual(THEMES.map((t) => t.id));
  });

  it("covers every field of the CLI's config type", () => {
    const body = cliConfig.slice(cliConfig.indexOf("interface EntryptaConfig"));
    const fields = [...body.slice(0, body.indexOf("\n}")).matchAll(/^ {2}(\$?\w+)\??:/gm)].map(
      (m) => m[1]
    );
    expect(fields.filter((f) => !(f in schema.properties))).toEqual([]);
  });

  it("rejects the aliases and srcDir values the CLI rejects", () => {
    const alias = new RegExp(schema.properties.aliases.properties.lib.pattern);
    expect(alias.test("@/lib")).toBe(true);
    expect(alias.test('@/lib"; import "evil')).toBe(false);
    const srcDir = schema.properties.srcDir;
    expect(new RegExp(srcDir.pattern).test("src")).toBe(true);
    expect(new RegExp(srcDir.not.pattern).test("../etc")).toBe(true);
  });
});
