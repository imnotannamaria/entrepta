#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program.name("entrepta").description("entrepta design system CLI").version("0.0.1");

program.parse();
