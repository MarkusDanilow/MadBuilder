"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./parser/Parser");
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const GeneratorFactory_1 = require("./generators/GeneratorFactory");
const path_1 = __importDefault(require("path"));
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
    choices: ["typescript", "ts", "python", "py", "csharp", "cs", "java", "javascript", "js", "php"],
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
        if (outputPath === undefined)
            throw "You must define an output path!";
        const entities = (0, Parser_1.parseYAML)(filePath);
        const allEntities = (0, Parser_1.generateAll)(entities);
        const generator = GeneratorFactory_1.GeneratorFactory.getGenerator(language, library);
        const entities2Generate = generator.filterEntities(allEntities);
        const outputContents = generator.generate(entities2Generate);
        // if there are going to be multiple files generated: 
        if (Array.isArray(outputContents)) {
            const outputBasePath = path_1.default.dirname(outputPath);
            const extension = (0, Parser_1.getFileExtensionForLanguage)(language);
            outputContents.forEach((output, index) => {
                generator.writeFiles(output.fileContent, `${outputBasePath}/${output.entityName}.${extension}`);
            });
        }
        // otherwise: simply generate a single file for all generated entities
        else {
            generator.writeFiles(outputContents, outputPath);
        }
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
