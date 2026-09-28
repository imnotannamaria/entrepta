import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { COMPONENT_INDEX, SECTIONS } from "./component-index";

const readme = fs.readFileSync(path.join(__dirname, "..", "..", "..", "README.md"), "utf8");

describe("README", () => {
  it("counts the components and sections the docs have", () => {
    expect(readme).toContain(
      `${COMPONENT_INDEX.length} components across ${SECTIONS.length} sections`
    );
  });

  it("lists every component in its section's row", () => {
    for (const section of SECTIONS) {
      const row = readme.split("\n").find((line) => line.startsWith(`| ${section} `)) ?? "";
      for (const c of COMPONENT_INDEX.filter((entry) => entry.section === section)) {
        expect(row, `${c.title} in the ${section} row`).toContain(c.title);
      }
    }
  });
});
