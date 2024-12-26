import path from "path";
import fs from "fs";

export function capitalizeFirstLetter(str: string): string {
    if (str.length === 0) return str; 
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function createOutputDirectory(outputPath: string): void {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
