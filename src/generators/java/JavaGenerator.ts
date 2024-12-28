import { Entity } from "../../parser/Parser";
import { GenerationResult, Generator } from "../Generator";

export class JavaGenerator extends Generator {

    generate(entities: Entity[]): string | GenerationResult[] {
        return entities.map((entity) => {
            const className = entity.name;
            const fields = entity.fields
                .map((field) => {
                    const type = this.getFieldType(field.type);
                    const fieldName = field.name;
                    const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

                    return `
                        private ${type} ${fieldName};

                        public ${type} get${capitalizedFieldName}() {
                            return ${fieldName};
                        }

                        public void set${capitalizedFieldName}(${type} ${fieldName}) {
                            this.${fieldName} = ${fieldName};
                        }`;
                })
                .join("\n");

            return {
                entityName: entity.name,
                fileContent: `import java.util.Date; \n\n 
                    public class ${className} {\n${fields}\n}`
            };
        });
    }


    getFieldType(type: string): string {
        const typeMapping: { [key: string]: string } = {
            int: "int",
            string: "String",
            boolean: "boolean",
            float: "float",
            date: "Date",
            object: "Object",
            array: "List<Object>",
            any: "Object",
            uuid: "UUID",
        };

        return typeMapping[type.toLowerCase()] || "Object";
    }
}
