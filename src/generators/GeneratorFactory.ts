import { Generator } from "./Generator";
import { PythonGenerator } from "./PythonGenerator";
import { TypeOrmGenerator } from "./typescript/TypeOrmGenerator";
import { TypescriptGenerator } from "./typescript/TypescriptGenerator";
import { ZodGenerator } from "./typescript/ZodGenerator";


/**
 * 
 */
export class GeneratorFactory {

    private static generatorRegistry: Record<string, Generator> = {
        // Typescript 
        "typescript": new TypescriptGenerator(),
        "typescript:zod": new ZodGenerator(),
        "typescript:typeorm": new TypeOrmGenerator(),
        "typescript:prisma": new TypescriptGenerator(),

        // Python
        "python": new PythonGenerator(),
    };


    static getGenerator(language: string, library?: string): Generator {
        const key = library !== undefined ? `${language}:${library}` : language;
        const generator = this.generatorRegistry[key];
        if (generator === undefined || generator === null) throw "No Generator available for " + key;
        return generator;
    }
}
