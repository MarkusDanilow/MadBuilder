"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaGenerator = void 0;
const Generator_1 = require("../Generator");
class PrismaGenerator extends Generator_1.Generator {
    generate(entities) {
        return entities
            .map((entity) => {
            const modelName = entity.name;
            const fields = entity.fields
                .map((field) => this.generateField(field))
                .join("\n");
            return `model ${modelName} { \n ${fields} \n }`;
        })
            .join("\n\n");
    }
    filterEntities(entities) {
        return entities.filter(e => e.name.toLowerCase().endsWith("db"));
    }
    generateField(field) {
        const fieldType = this.getFieldType(field.type);
        const optional = field.required ? "" : "?";
        const attributes = this.generateFieldAttributes(field);
        return `  ${field.name}${optional}: ${fieldType} ${attributes}`;
    }
    generateFieldAttributes(field) {
        const attributes = [];
        if (field.name === "id") {
            attributes.push("@id", "@unique");
        }
        else {
            if (field.unique) {
                attributes.push("@unique");
            }
            if (field.type === "string" && field.maxLength !== undefined) {
                attributes.push(`@db.VarChar(${field.maxLength})`);
            }
        }
        return attributes.join(" ");
    }
    getFieldType(type) {
        const typeMapping = {
            int: "Int",
            string: "String",
            boolean: "Boolean",
            float: "Float",
            date: "DateTime",
        };
        return typeMapping[type.toLowerCase()] || "Json";
    }
}
exports.PrismaGenerator = PrismaGenerator;
