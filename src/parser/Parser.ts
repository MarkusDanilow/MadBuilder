import fs from "fs";
import { parse } from "yaml";
import { capitalizeFirstLetter } from "../util/Utils";

// Typen für das Modell
export interface Field {
    name: string;
    type: string;
    required?: boolean;
    contexts?: string[];
    min?: number;         // Für minimale Zahl oder Länge
    max?: number;         // Für maximale Zahl oder Länge
    minLength?: number;   // Für minimale Länge (Strings)
    maxLength?: number;   // Für maximale Länge (Strings)
    format?: string;      // Z. B. "email", "phone"
}

export interface Entity {
    contexts?: string[];
    name: string,
    fields: Field[];
}

/**
 * 
 * @param filePath 
 * @returns 
 */
export function parseYAML(filePath: string): Entity[] {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const entities = parse(fileContent) as Entity;
    return Object.entries(entities).map(([name, details]) => ({
        name,
        contexts: details.contexts,
        fields: details.fields
    }));
}

/**
 * 
 * @param entities 
 * @param context 
 * @returns 
 */
export function filterByContext(entities: Entity[], context?: string): Entity[] {
    if (context === undefined || entities.length <= 0) return entities;
    return entities.map((entity) => ({
        ...entity,
        name: `${entity.name}${capitalizeFirstLetter(context)}`,
        fields: entity.fields.filter(
            (field) => (field.contexts === undefined) || (field.contexts !== undefined && field.contexts.includes(context))
        ),
    }));
}

/**
 * 
 * @param entities 
 */
export function generateAll(entities: Entity[]): Entity[] {
    const generatedEntities: Entity[] = [];
    entities.forEach((entity) => {
        if (entity.contexts === undefined || entity.contexts.length <= 0) {
            generatedEntities.push(entity);
        }
        else {
            entity.contexts.forEach((context) => {
                const filtered = filterByContext([entity], context);
                if (filtered.length > 0) {
                    const newEntity = filtered[0];
                    const entityExists = generatedEntities.some(ge => ge.name === newEntity.name)
                    if (!entityExists) { generatedEntities.push(newEntity); }
                }
            })
        }
    })
    return generatedEntities;
}