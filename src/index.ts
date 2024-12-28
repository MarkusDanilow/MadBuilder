import * as fs from "fs";
import { generateAll, getFileExtensionForLanguage, parseYAML } from "./parser/Parser";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createOutputDirectory } from "./util/Utils";
import { GeneratorFactory } from "./generators/GeneratorFactory";
import path from "path";

interface CLIOptions {
    file: string;
    language: string;
    library?: string;
    context?: string;
    output?: string;
}

const argv = yargs(hideBin(process.argv))
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
    .parse() as CLIOptions;

(async function main() {
    try {
        const filePath = argv.file;
        const context = argv.context;
        const language = argv.language;
        const library = argv.library;
        const outputPath = argv.output;

        if (outputPath === undefined) throw "You must define an output path!";

        const entities = parseYAML(filePath);
        const allEntities = generateAll(entities);

        const generator = GeneratorFactory.getGenerator(language, library);
        const entities2Generate = generator.filterEntities(allEntities);
        const outputContents = generator.generate(entities2Generate);

        // if there are going to be multiple files generated: 
        if (Array.isArray(outputContents)) {
            const outputBasePath = path.dirname(outputPath);
            const extension = getFileExtensionForLanguage(language);
            outputContents.forEach((output, index) => {
                generator.writeFiles(output.fileContent, `${outputBasePath}/${output.entityName}.${extension}`);
            });
        }
        // otherwise: simply generate a single file for all generated entities
        else {
            generator.writeFiles(outputContents, outputPath);
        }

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        } else {
            console.error("Unknown error occurred:", error);
        }
        process.exit(1);
    }
})();