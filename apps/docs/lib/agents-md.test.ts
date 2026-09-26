import { describe, expect, it } from "vitest";
import { type AgentsOptions, FRAMEWORKS, buildAgentsMd } from "./agents-md";
import { PICKABLE } from "./manifest";

const BASE: AgentsOptions = {
  framework: "next-app",
  theme: "entrepta",
  mode: "dark",
  themes: "single",
  pm: "pnpm",
  components: ["button", "card", "field"],
  fileName: "AGENTS.md",
};

describe("buildAgentsMd", () => {
  for (const framework of FRAMEWORKS) {
    it(`matches the snapshot for ${framework}`, () => {
      expect(buildAgentsMd({ ...BASE, framework })).toMatchSnapshot();
    });
  }

  it("writes the install commands for the package manager, theme and themes mode", () => {
    const md = buildAgentsMd({ ...BASE, pm: "bun", theme: "ivy", themes: "all" });
    expect(md).toContain("bunx @entrepta/cli@latest init --theme=ivy --themes=all");
    expect(md).toContain("bunx @entrepta/cli@latest add button card field");
  });

  it("has a cheat sheet entry for every component in the manifest when all are picked", () => {
    const md = buildAgentsMd({ ...BASE, components: PICKABLE.map((c) => c.name) });
    const missing = PICKABLE.filter(
      (c) => !md.includes(`/docs/components/${c.name}`) || !md.includes(c.usage ?? "unreachable")
    ).map((c) => c.name);
    expect(missing).toEqual([]);
  });

  it("imports from the alias the framework actually uses", () => {
    expect(buildAgentsMd(BASE)).toContain('from "@/app/components/entrepta/button"');
    expect(buildAgentsMd({ ...BASE, framework: "vite" })).toContain(
      'from "@/components/entrepta/button"'
    );
    expect(buildAgentsMd({ ...BASE, framework: "vite" })).toContain("src/components/entrepta/");
  });

  it("lists what comes along as a dependency", () => {
    expect(buildAgentsMd({ ...BASE, components: ["card"] })).toContain(
      "Also installed as dependencies: `diamond`"
    );
  });

  it("never contains a hex color", () => {
    const md = buildAgentsMd({ ...BASE, components: PICKABLE.map((c) => c.name) });
    expect(md.match(/#[0-9a-f]{3,8}\b/gi)).toBeNull();
  });

  it("only has a motion section when a picked component animates", () => {
    expect(buildAgentsMd(BASE)).not.toContain("## Motion");
    expect(buildAgentsMd({ ...BASE, components: ["reveal"] })).toContain("## Motion");
    // tabs animate their underline through motion
    expect(buildAgentsMd({ ...BASE, components: ["tabs"] })).toContain("## Motion");
  });

  it("mentions suppressHydrationWarning for Next.js only", () => {
    expect(buildAgentsMd(BASE)).toContain("suppressHydrationWarning");
    expect(buildAgentsMd({ ...BASE, framework: "vite" })).not.toContain("suppressHydrationWarning");
  });

  it("ignores names that are not components", () => {
    const md = buildAgentsMd({ ...BASE, components: ["button", "nope", "motion-lib"] });
    expect(md).toContain("add button\n");
    expect(md).not.toContain("nope");
  });

  it("points the agent at the Markdown docs and llms.txt", () => {
    const md = buildAgentsMd(BASE);
    expect(md).toContain("## Reading the docs");
    expect(md).toContain("https://entrepta.vercel.app/llms.txt");
    expect(md).toContain("https://entrepta.vercel.app/docs/components/button.md");
    expect(md).toContain("https://entrepta.vercel.app/docs/components.md");
  });
});
