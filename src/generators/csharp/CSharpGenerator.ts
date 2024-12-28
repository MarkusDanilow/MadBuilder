import { Entity } from "../../parser/Parser";
import { GenerationResult, Generator } from "../Generator";

export class CSharpGenerator extends Generator {

    generate(entities: Entity[]): string | GenerationResult[] {
        return entities.map((entity) => {
            const className = entity.name;
            const fields = entity.fields
                .map((field) => {
                    const type = this.getFieldType(field.type);
                    const required = field.required ? "" : "?";
                    const validationAttributes = [];
                    if (field.min !== undefined) validationAttributes.push(`[MinLength(${field.min})]`);
                    if (field.max !== undefined) validationAttributes.push(`[MaxLength(${field.max})]`);
                    if (field.minLength !== undefined) validationAttributes.push(`[MinLength(${field.minLength})]`);
                    if (field.maxLength !== undefined) validationAttributes.push(`[MaxLength(${field.maxLength})]`);
                    if (field.format) validationAttributes.push(`[Format("${field.format}")]`);
                    const attributes = validationAttributes.length > 0 ? `${validationAttributes.join(" ")}\n` : "";
                    return `${attributes}public ${type}${required} ${field.name} { get; set; }`;
                })
                .join("\n");
            return `public class ${className} {\n${fields}\n}`;
        }).join("\n\n")
    }

    getFieldType(type: string): string {
        const typeMapping: { [key: string]: string } = {
            int: "int",
            string: "string",
            boolean: "bool",
            float: "float",
            date: "DateTime",
            object: "object",
            array: "List<object>",
            any: "object",
            uuid: "Guid",
        };

        return typeMapping[type.toLowerCase()] || "object";
    }
}
