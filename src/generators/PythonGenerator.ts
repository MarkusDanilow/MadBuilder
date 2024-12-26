import path from "path";
import { Entity } from "../parser/Parser";
import { Generator } from "./Generator";
import * as fs from "fs";


export class PythonGenerator extends Generator {

    /**
     * Generiert das Python Modell für die übergebenen Entitäten
     * @param entities 
     * @returns 
     */
    generate(entities: Entity[]): string {
        return entities
            .map((entity) => {
                const className = entity.name;
                const fields = entity.fields
                    .map((field) => {
                        const type = this.getFieldType(field.type);
                        const required = field.required ? "" : " = None";
                        return `    ${field.name}: ${type}${required}`;
                    })
                    .join("\n");

                return `class ${className}:\n${fields}\n`;
            })
            .join("\n\n");
    }

    /**
     * Wandelt den Typ in Python-Typen um
     * @param type 
     * @returns 
     */
    getFieldType(type: string): string {
        const typeMapping: { [key: string]: string } = {
            int: "int",
            string: "str",
            boolean: "bool",
            float: "float",
            date: "str",  // Für Python könnte man das als str behandeln oder mit einer speziellen Bibliothek wie datetime arbeiten
            object: "dict",
            array: "list", // Standard für Array
            any: "Any",
            uuid: "str", // UUID als string
        };

        return typeMapping[type.toLowerCase()] || "Any"; // Standardwert: Any
    }

    /**
     * 
     * @param output 
     * @param outputPath 
     */
    writeFiles(output: string, outputPath?: string): void {
        super.writeFiles(output, outputPath);
        if (outputPath !== undefined) {
            const outputDir = path.dirname(outputPath)
            const initFile = `${outputDir}/__init__.py`;
            if (!fs.existsSync(initFile)) {
                fs.writeFileSync(initFile, "# Auto-generated package");
            }
        }

    }

}
