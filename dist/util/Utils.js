"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.createOutputDirectory = createOutputDirectory;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function capitalizeFirstLetter(str) {
    if (str.length === 0)
        return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function createOutputDirectory(outputPath) {
    const dir = path_1.default.dirname(outputPath);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
}
