import { Entity } from "../../parser/Parser";
import { GenerationResult, Generator } from "../Generator";

export class JavaScriptGenerator extends Generator {

    generate(entities: Entity[]): string | GenerationResult[] {
        return entities
            .map((entity) => {
                const className = entity.name;
                const fields = entity.fields
                    .map((field) => {
                        const fieldName = field.name;
                        const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                        return `this.${fieldName} = ${fieldName};`
                    })
                    .join("\n");

                const gettersAndSetters = entity.fields.map((field) => {
                    const fieldName = field.name;
                    const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                    return `get${capitalizedFieldName}() {
                                return this.${fieldName};
                            }

                            set${capitalizedFieldName}(${fieldName}) {
                                this.${fieldName} = ${fieldName};
                            }`;
                })
                    .join("\n");

                return `class ${className} {
                        constructor(${entity.fields.map(field => field.name).join(', ')}) {
                        ${fields}
                        }
                        ${gettersAndSetters}
                    } `;
            })
            .join("\n\n");
    }

    /**
     * 
     * @param type 
     */
    getFieldType(type: string): string {
        throw new Error("Method not implemented.");
    }
}