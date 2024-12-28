"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYAML = parseYAML;
exports.filterByContext = filterByContext;
exports.generateAll = generateAll;
exports.getFileExtensionForLanguage = getFileExtensionForLanguage;
const fs_1 = __importDefault(require("fs"));
const yaml_1 = require("yaml");
const Utils_1 = require("../util/Utils");
/**
 *
 * @param filePath
 * @returns
 */
function parseYAML(filePath) {
    const fileContent = fs_1.default.readFileSync(filePath, "utf8");
    const entities = (0, yaml_1.parse)(fileContent);
    return Object.entries(entities).map(([name, details]) => ({
        name,
        contexts: details.contexts,
        fields: details.fields
    }));
}
/**
 *
 * @param entities
 * @param context
 * @returns
 */
function filterByContext(entities, context) {
    if (context === undefined || entities.length <= 0)
        return entities;
    return entities.map((entity) => ({
        ...entity,
        name: `${entity.name}${(0, Utils_1.capitalizeFirstLetter)(context)}`,
        fields: entity.fields.filter((field) => (field.contexts === undefined) || (field.contexts !== undefined && field.contexts.includes(context))),
    }));
}
/**
 *
 * @param entities
 */
function generateAll(entities) {
    const generatedEntities = [];
    entities.forEach((entity) => {
        if (entity.contexts === undefined || entity.contexts.length <= 0) {
            generatedEntities.push(entity);
        }
        else {
            entity.contexts.forEach((context) => {
                const filtered = filterByContext([entity], context);
                if (filtered.length > 0) {
                    const newEntity = filtered[0];
                    const entityExists = generatedEntities.some(ge => ge.name === newEntity.name);
                    if (!entityExists) {
                        generatedEntities.push(newEntity);
                    }
                }
            });
        }
    });
    return generatedEntities;
}
function getFileExtensionForLanguage(language) {
    switch (language) {
        case "typescript":
        case "ts": return "ts";
        case "python":
        case "py": return "py";
        case "csharp":
        case "cs": return "cs";
        case "java": return "java";
        default: throw "Unsupported language!";
    }
}
