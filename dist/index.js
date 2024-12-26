"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./parser/Parser");
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const GeneratorFactory_1 = require("./generators/GeneratorFactory");
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .option("file", {
    alias: "f",
    type: "string",
    description: "Path to the YAML file",
    demandOption: true,
})
    .option("language", {
    alias: "l",
    type: "string",
    description: "The language for the generated models",
    choices: ["typescript", "python"],
    demandOption: true
})
    .option("library", {
    alias: "lib",
    type: "string",
    description: "The specific library or framework for the generated models",
    choices: ["zod", "typeorm", "prisma"],
    demandOption: false,
})
    // .option("context", {
    //     alias: "c",
    //     type: "string",
    //     description: "Filter fields by context",
    // })
    .option("output", {
    alias: "o",
    type: "string",
    description: "Path to save the output",
})
    .help()
    .parse();
(async function main() {
    try {
        const filePath = argv.file;
        const context = argv.context;
        const language = argv.language;
        const library = argv.library;
        const outputPath = argv.output;
        const entities = (0, Parser_1.parseYAML)(filePath);
        const allEntities = (0, Parser_1.generateAll)(entities);
        const generator = GeneratorFactory_1.GeneratorFactory.getGenerator(language, library);
        const entities2Generate = generator.filterEntities(allEntities);
        const output = generator.generate(entities2Generate);
        generator.writeFiles(output, outputPath);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
        else {
            console.error("Unknown error occurred:", error);
        }
        process.exit(1);
    }
})();
