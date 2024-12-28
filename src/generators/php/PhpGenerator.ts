import { Entity } from "../../parser/Parser";
import { GenerationResult, Generator } from "../Generator";

export class PHPGenerator extends Generator {

    generate(entities: Entity[]): string | GenerationResult[] {
        return "<?php" + entities
            .map((entity) => {
                const className = entity.name;
                const fields = entity.fields
                    .map((field) => {
                        const fieldName = field.name;
                        const capitalizedFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

                        return `
    private $${fieldName};

    public function get${capitalizedFieldName}() {
        return $this->${fieldName};
    }

    public function set${capitalizedFieldName}($${fieldName}) {
        $this->${fieldName} = $${fieldName};
    }`;
                    })
                    .join("\n");

                return `class ${className} {
    ${fields}
}`;
            })
            .join("\n\n");
    }


    getFieldType(type: string): string {
        throw new Error("Method not implemented.");
    }

}