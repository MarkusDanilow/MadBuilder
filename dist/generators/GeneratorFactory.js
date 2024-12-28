"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorFactory = void 0;
const CSharpGenerator_1 = require("./csharp/CSharpGenerator");
const JavaGenerator_1 = require("./java/JavaGenerator");
const JavascriptGenerator_1 = require("./javascript/JavascriptGenerator");
const PhpGenerator_1 = require("./php/PhpGenerator");
const PythonGenerator_1 = require("./PythonGenerator");
const PrismaGenerator_1 = require("./typescript/PrismaGenerator");
const TypeOrmGenerator_1 = require("./typescript/TypeOrmGenerator");
const TypescriptGenerator_1 = require("./typescript/TypescriptGenerator");
const ZodGenerator_1 = require("./typescript/ZodGenerator");
/**
 *
 */
class GeneratorFactory {
    static getGenerator(language, library) {
        const key = library !== undefined ? `${language}:${library}` : language;
        const generator = this.generatorRegistry[key];
        if (generator === undefined || generator === null)
            throw "No Generator available for " + key;
        return generator;
    }
}
exports.GeneratorFactory = GeneratorFactory;
GeneratorFactory.generatorRegistry = {
    // Typescript 
    "typescript": new TypescriptGenerator_1.TypescriptGenerator(),
    "ts": new TypescriptGenerator_1.TypescriptGenerator(),
    "typescript:zod": new ZodGenerator_1.ZodGenerator(),
    "typescript:typeorm": new TypeOrmGenerator_1.TypeOrmGenerator(),
    "typescript:prisma": new PrismaGenerator_1.PrismaGenerator(),
    // Python
    "python": new PythonGenerator_1.PythonGenerator(),
    "py": new PythonGenerator_1.PythonGenerator(),
    // C#
    "csharp": new CSharpGenerator_1.CSharpGenerator(),
    "cs": new CSharpGenerator_1.CSharpGenerator(),
    // Java 
    "java": new JavaGenerator_1.JavaGenerator(),
    // PHP
    "php": new PhpGenerator_1.PHPGenerator(),
    // JavaScript 
    "javascript": new JavascriptGenerator_1.JavaScriptGenerator(),
    "js": new JavascriptGenerator_1.JavaScriptGenerator()
};
