"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmGenerator = void 0;
const Generator_1 = require("../Generator");
class TypeOrmGenerator extends Generator_1.Generator {
    generate(entities) {
        return entities
            .map((entity) => {
            const className = entity.name;
            const fields = entity.fields
                .map((field) => this.generateField(field))
                .join("\n");
            return `import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";\n\n@Entity("${className.toLowerCase()}")\nexport class ${className} {\n${fields}\n}`;
        })
            .join("\n\n");
    }
    filterEntities(entities) {
        return entities.filter(e => e.name.toLowerCase().endsWith("db"));
    }
    generateField(field) {
        const decorators = this.generateFieldDecorators(field);
        const typeScriptType = this.getFieldType(field.type);
        const optional = field.required ? "" : "?";
        return `  ${decorators}\n  ${field.name}${optional}: ${typeScriptType};`;
    }
    generateFieldDecorators(field) {
        const decorators = [];
        // Primary Key
        if (field.name === "id") {
            decorators.push("@PrimaryGeneratedColumn()");
        }
        else {
            const columnOptions = [];
            // TypeORM Column Type
            const dbType = this.getDatabaseType(field.type, field.format);
            if (dbType)
                columnOptions.push(`type: "${dbType}"`);
            // Nullable
            if (!field.required)
                columnOptions.push("nullable: true");
            // Validation: min/max length for strings
            // if (field.minLength !== undefined) columnOptions.push(`length: ${field.maxLength}`);
            if (field.maxLength !== undefined)
                columnOptions.push(`length: ${field.maxLength}`);
            // Validation: min/max for numbers
            // if (field.min !== undefined) columnOptions.push(`min: ${field.min}`);
            // if (field.max !== undefined) columnOptions.push(`max: ${field.max}`);
            // Add options to @Column
            const columnOptionsString = columnOptions.length > 0 ? `{ ${columnOptions.join(", ")} }` : "";
            decorators.push(`@Column(${columnOptionsString})`);
        }
        return decorators.join("\n  ");
    }
    getDatabaseType(type, format) {
        if (format === "uuid")
            return "uuid";
        const typeMapping = {
            int: "int",
            string: "varchar",
            boolean: "boolean",
            float: "float",
            date: "timestamp",
        };
        return typeMapping[type.toLowerCase()] || "text";
    }
    getFieldType(type) {
        const typeMapping = {
            int: "number",
            string: "string",
            boolean: "boolean",
            float: "number",
            date: "Date",
        };
        return typeMapping[type.toLowerCase()] || "any";
    }
}
exports.TypeOrmGenerator = TypeOrmGenerator;
