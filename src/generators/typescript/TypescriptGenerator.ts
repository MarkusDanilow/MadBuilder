import { Entity } from "../../parser/Parser";
import { Generator } from "../Generator";

export class TypescriptGenerator extends Generator {
    generate(entities: Entity[]): string {
        return entities
            .map((entity) => {
                const className = entity.name;
                const fields = entity.fields
                    .map((field) => {
                        const type = this.getFieldType(field.type);
                        const required = field.required ? "" : "?";

                        const validationComments = [];
                        if (field.min !== undefined) validationComments.push(`@min ${field.min}`);
                        if (field.max !== undefined) validationComments.push(`@max ${field.max}`);
                        if (field.minLength !== undefined) validationComments.push(`@minLength ${field.minLength}`);
                        if (field.maxLength !== undefined) validationComments.push(`@maxLength ${field.maxLength}`);
                        if (field.format) validationComments.push(`@format ${field.format}`);

                        const comments = validationComments.length > 0 ? `/** ${validationComments.join(", ")} */\n` : "";

                        return `${comments}  ${field.name}${required}: ${type};`;
                    })
                    .join("\n");

                return `export interface ${className} {\n${fields}\n}`;
            })
            .join("\n\n");
    }

    getFieldType(type: string): string {
        const typeMapping: { [key: string]: string } = {
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
