import { CSharpGenerator } from "./csharp/CSharpGenerator";
import { Generator } from "./Generator";
import { JavaGenerator } from "./java/JavaGenerator";
import { JavaScriptGenerator } from "./javascript/JavascriptGenerator";
import { PHPGenerator } from "./php/PhpGenerator";
import { PythonGenerator } from "./PythonGenerator";
import { PrismaGenerator } from "./typescript/PrismaGenerator";
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
        "ts": new TypescriptGenerator(),
        "typescript:zod": new ZodGenerator(),
        "typescript:typeorm": new TypeOrmGenerator(),
        "typescript:prisma": new PrismaGenerator(),

        // Python
        "python": new PythonGenerator(),
        "py": new PythonGenerator(),

        // C#
        "csharp": new CSharpGenerator(),
        "cs": new CSharpGenerator(),

        // Java 
        "java": new JavaGenerator(),

        // PHP
        "php": new PHPGenerator(),

        // JavaScript 
        "javascript": new JavaScriptGenerator(),
        "js": new JavaScriptGenerator()
    };


    static getGenerator(language: string, library?: string): Generator {
        const key = library !== undefined ? `${language}:${library}` : language;
        const generator = this.generatorRegistry[key];
        if (generator === undefined || generator === null) throw "No Generator available for " + key;
        return generator;
    }
}
