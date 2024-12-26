"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypescriptGenerator = void 0;
const Generator_1 = require("./Generator");
class TypescriptGenerator extends Generator_1.Generator {
    /**
     *
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
                const required = field.required ? "" : "?";
                return `  ${field.name}${required}: ${type};`;
            })
                .join("\n");
            return `export interface ${className} {\n${fields}\n}`;
        })
            .join("\n\n");
    }
    /**
     *
     * @param type
     * @returns
     */
    getFieldType(type) {
        const typeMapping = {
            int: "number",
            string: "string",
            boolean: "boolean",
            float: "number",
            date: "Date",
            object: "object",
            array: "any[]", // Standard für Array
            any: "any",
            uuid: "string", // UUID als string (häufig in APIs verwendet)
            // Hier können bei Bedarf noch weitere Typen hinzugefügt werden
        };
        // Falls der Typ im Mapping nicht gefunden wird, standardmäßig `any`
        return typeMapping[type.toLowerCase()] || "any";
    }
}
exports.TypescriptGenerator = TypescriptGenerator;
