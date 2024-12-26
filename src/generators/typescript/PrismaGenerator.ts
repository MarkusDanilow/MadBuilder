import { Generator } from "../Generator";
import { Entity } from "../../parser/Parser";

export class PrismaGenerator extends Generator {

    generate(entities: Entity[]): string {
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

    filterEntities(entities: Entity[]): Entity[] {
        return entities.filter(e => e.name.toLowerCase().endsWith("db"));
    }

    private generateField(field: any): string {
        const fieldType = this.getFieldType(field.type);
        const optional = field.required ? "" : "?";
        const attributes = this.generateFieldAttributes(field);

        return `  ${field.name}${optional}: ${fieldType} ${attributes}`;
    }

    private generateFieldAttributes(field: any): string {
        const attributes = [];

        if (field.name === "id") {
            attributes.push("@id", "@unique");
        } else {
            if (field.unique) {
                attributes.push("@unique");
            }

            if (field.type === "string" && field.maxLength !== undefined) {
                attributes.push(`@db.VarChar(${field.maxLength})`);
            }
        }

        return attributes.join(" ");
    }

    getFieldType(type: string): string {
        const typeMapping: { [key: string]: string } = {
            int: "Int",
            string: "String",
            boolean: "Boolean",
            float: "Float",
            date: "DateTime",
        };
        return typeMapping[type.toLowerCase()] || "Json";
    }
}
