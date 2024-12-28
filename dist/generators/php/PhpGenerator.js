"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHPGenerator = void 0;
const Generator_1 = require("../Generator");
class PHPGenerator extends Generator_1.Generator {
    generate(entities) {
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
    getFieldType(type) {
        throw new Error("Method not implemented.");
    }
}
exports.PHPGenerator = PHPGenerator;
