/** Every link that leaves the site, in one place, so none of them rots as a `#`. */
export const LINKS = {
  github: "https://github.com/imnotannamaria/entrepta",
  author: "https://annamaria.app",
  wristkit: "https://wristkit-web.vercel.app",
  x: "https://x.com/annamariadevbr",
  npmCli: "https://www.npmjs.com/package/@entrepta/cli",
  npmRegistry: "https://www.npmjs.com/package/@entrepta/registry",
  changelog: "https://github.com/imnotannamaria/entrepta/blob/main/packages/cli/CHANGELOG.md",
  releases: "https://github.com/imnotannamaria/entrepta/releases",
} as const;

/** The two published packages, for the npm cards on the CLI and install pages. */
export const PACKAGES = [
  {
    name: "@entrepta/cli",
    href: LINKS.npmCli,
    bin: "entrepta",
    what: "The command you run: init writes the tokens, add copies components. Run it with npx, nothing to install.",
    run: "npx @entrepta/cli@latest init",
  },
  {
    name: "@entrepta/registry",
    href: LINKS.npmRegistry,
    bin: null,
    what: "The source the CLI copies from, and the manifest that lists every component, its files and its deps.",
    run: "npm view @entrepta/registry",
  },
] as const;

/** Projects built on entrepta, the first ones and its real test cases. */
export const USED_BY = [
  { name: "annamaria.app", href: LINKS.author, what: "a personal site posed as an IDE" },
  { name: "wristkit", href: LINKS.wristkit, what: "Apple Health components for Next.js" },
] as const;
