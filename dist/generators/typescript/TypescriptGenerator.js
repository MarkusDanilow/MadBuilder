"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypescriptGenerator = void 0;
const Generator_1 = require("../Generator");
class TypescriptGenerator extends Generator_1.Generator {
    generate(entities) {
        return entities
            .map((entity) => {
            const className = entity.name;
            const fields = entity.fields
                .map((field) => {
                const type = this.getFieldType(field.type);
                const required = field.required ? "" : "?";
                const validationComments = [];
                if (field.min !== undefined)
                    validationComments.push(`@min ${field.min}`);
                if (field.max !== undefined)
                    validationComments.push(`@max ${field.max}`);
                if (field.minLength !== undefined)
                    validationComments.push(`@minLength ${field.minLength}`);
                if (field.maxLength !== undefined)
                    validationComments.push(`@maxLength ${field.maxLength}`);
                if (field.format)
                    validationComments.push(`@format ${field.format}`);
                const comments = validationComments.length > 0 ? `/** ${validationComments.join(", ")} */\n` : "";
                return `${comments}  ${field.name}${required}: ${type};`;
            })
                .join("\n");
            return `export interface ${className} {\n${fields}\n}`;
        })
            .join("\n\n");
    }
    getFieldType(type) {
        const typeMapping = {
            int: "number",
            string: "string",
            boolean: "boolean",
            float: "number",
            date: "Date",
            object: "object",
            array: "any[]",
            any: "any",
            uuid: "string",
        };
        return typeMapping[type.toLowerCase()] || "any";
    }
}
exports.TypescriptGenerator = TypescriptGenerator;
