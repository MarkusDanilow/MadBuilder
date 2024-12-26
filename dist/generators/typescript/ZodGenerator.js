"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodGenerator = void 0;
const Generator_1 = require("../Generator");
class ZodGenerator extends Generator_1.Generator {
    generate(entities) {
        return "import { z } from 'zod'; \n\n" + entities
            .map((entity) => {
            const schemaName = `${entity.name}Schema`;
            const fields = entity.fields
                .map((field) => {
                let zodField = `z.${this.getFieldType(field.type)}()`;
                if (field.min !== undefined)
                    zodField += `.min(${field.min})`;
                if (field.max !== undefined)
                    zodField += `.max(${field.max})`;
                if (field.minLength !== undefined)
                    zodField += `.min(${field.minLength})`;
                if (field.maxLength !== undefined)
                    zodField += `.max(${field.maxLength})`;
                if (field.format === "email")
                    zodField += `.email()`;
                if (field.format === "phone")
                    zodField += `.regex(/^[+]?[0-9]{10,15}$/)`;
                if (field.format === "uuid")
                    zodField += `.uuid()`;
                if (!field.required)
                    zodField += `.optional()`;
                return `  ${field.name}: ${zodField},`;
            })
                .join("\n");
            return `export const ${schemaName} = z.object({\n${fields}\n});`;
        })
            .join("\n\n");
    }
    getFieldType(type) {
        const typeMapping = {
            int: "number",
            string: "string",
            boolean: "boolean",
            float: "number",
            date: "date",
            object: "object",
            array: "array",
            any: "any",
        };
        return typeMapping[type.toLowerCase()] || "any";
    }
}
exports.ZodGenerator = ZodGenerator;
