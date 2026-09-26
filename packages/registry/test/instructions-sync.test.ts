import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * CLAUDE.md and AGENTS.md are the same project context for two agents. They
 * may differ only where they name the agent or themselves.
 */

const REPO = path.resolve(__dirname, "../../..");
const read = (file: string) => fs.readFileSync(path.join(REPO, file), "utf8");

const normalize = (text: string) =>
  text
    .replace("Project context for Claude Code.", "Project context for <agent>.")
    .replace("Project context for Codex.", "Project context for <agent>.")
    .replace("## 11. How Claude should work here", "## 11. How <agent> should work here")
    .replace("## 11. How Codex should work here", "## 11. How <agent> should work here")
    .replace("└── CLAUDE.md", "└── <self>")
    .replace("└── AGENTS.md", "└── <self>");

describe("agent instructions", () => {
  it("keeps CLAUDE.md and AGENTS.md in sync", () => {
    expect(normalize(read("AGENTS.md"))).toBe(normalize(read("CLAUDE.md")));
  });
});
