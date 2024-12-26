import { Entity } from "../parser/Parser";
import { createOutputDirectory } from "../util/Utils";
import * as fs from "fs";

export abstract class Generator {

    abstract generate(entities: Entity[]): string;

    abstract getFieldType(type: string): string;

    filterEntities(entities: Entity[]): Entity[] {
        return entities.filter(e => !e.name.toLowerCase().endsWith("db"));
    }

    writeFiles(output: string, outputPath?: string): void {
        if (outputPath) {
            createOutputDirectory(outputPath);
            fs.writeFileSync(outputPath, output, "utf8");
            console.log(`Output saved to ${outputPath}`);
        } else {
            console.log("Parsed Entities:");
            console.log(output);
        }
    }

}