"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileType = exports.fileTypes = void 0;
const path_1 = require("path");
exports.fileTypes = ["txt", "json", "yaml", "csv"];
exports.getFileType = (program, filename) => {
    switch (true) {
        case program.json:
            return "json";
        case program.text:
            return "txt";
        case program.yaml:
            return "yaml";
        case program.csv:
            return "csv";
    }
    if (filename) {
        const ext = path_1.extname(filename).substr(1);
        if (!exports.fileTypes.includes(ext)) {
            throw new Error(`${ext} is not recognized format`);
        }
        return ext;
    }
    return "txt";
};
