import { createRequire } from "node:module";
import { Command } from "commander";
import { add } from "./commands/add.js";
import { init } from "./commands/init.js";

// package.json sits one level up from both src/ and dist/, and npm always publishes it
const { version } = createRequire(import.meta.url)("../package.json") as { version: string };

const program = new Command();

program.name("entrepta").description("entrepta design system CLI").version(version);

program
  .command("init")
  .description("initialize entrepta in your project")
  .option("-t, --theme <theme>", "theme preset (entrepta|blossom|marmalade|julia|ivy|bosco)")
  .option("--themes <mode>", "single: one fixed theme. all: six themes, switchable at runtime")
  .option("--overwrite", "overwrite existing files", false)
  .action(init);

program
  .command("add [components...]")
  .description("add components to your project")
  .option("--overwrite", "overwrite existing files", false)
  .action(add);

program.parse();
