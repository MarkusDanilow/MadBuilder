"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonGenerator = void 0;
const path_1 = __importDefault(require("path"));
const Generator_1 = require("./Generator");
const fs = __importStar(require("fs"));
class PythonGenerator extends Generator_1.Generator {
    /**
     * Generiert das Python Modell für die übergebenen Entitäten
     * @param entities
     * @returns
     */
    generate(entities) {
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
    getFieldType(type) {
        const typeMapping = {
            int: "int",
            string: "str",
            boolean: "bool",
            float: "float",
            date: "str", // Für Python könnte man das als str behandeln oder mit einer speziellen Bibliothek wie datetime arbeiten
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
    writeFiles(output, outputPath) {
        super.writeFiles(output, outputPath);
        if (outputPath !== undefined) {
            const outputDir = path_1.default.dirname(outputPath);
            const initFile = `${outputDir}/__init__.py`;
            if (!fs.existsSync(initFile)) {
                fs.writeFileSync(initFile, "# Auto-generated package");
            }
        }
    }
}
exports.PythonGenerator = PythonGenerator;
