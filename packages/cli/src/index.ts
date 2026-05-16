import { Command } from "commander";
import { add } from "./commands/add.js";
import { init } from "./commands/init.js";

const program = new Command();

program.name("entrepta").description("entrepta design system CLI").version("0.0.1");

program
  .command("init")
  .description("initialize entrepta in your project")
  .option("-t, --theme <theme>", "theme preset (entrepta|blossom|marmalade|julia|ivy|bosco)")
  .option("--overwrite", "overwrite existing files", false)
  .action(init);

program
  .command("add [components...]")
  .description("add components to your project")
  .option("--overwrite", "overwrite existing files", false)
  .action(add);

program.parse();
