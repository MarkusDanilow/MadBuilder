"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorFactory = void 0;
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
    "typescript:zod": new ZodGenerator_1.ZodGenerator(),
    "typescript:typeorm": new TypeOrmGenerator_1.TypeOrmGenerator(),
    "typescript:prisma": new PrismaGenerator_1.PrismaGenerator(),
    // Python
    "python": new PythonGenerator_1.PythonGenerator(),
};
