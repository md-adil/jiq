#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const query = __importStar(require("./query"));
const printer = __importStar(require("./printer"));
const file = __importStar(require("./file"));
function main(rawQuery, filename) {
    let fileType = file.getFileType(commander_1.program, filename);
    const commands = query.build(rawQuery);
    file.read(filename, fileType, (data) => {
        if (commander_1.program.save) {
            file.write(query.run(commands, data), commander_1.program.save, fileType);
        }
        else {
            printer.print(query.run(commands, data), fileType, commander_1.program.print);
        }
    });
}
;
commander_1.program.version("0.0.4");
commander_1.program
    .option('--json', 'tell the program it\'s json content')
    .option('--text', 'tell the program it\'s text content')
    .option('--yaml', 'tell the program it\'s yaml content')
    .option('--html', 'tell the program it\'s html content')
    .option('--print <format>', 'printer format (table)')
    .option('--save <filename>', 'save output to a file')
    .arguments(`<query> [filename]`)
    .description(`'.name' package.json`)
    .action((query, filename) => {
    try {
        main(query, filename);
    }
    catch (err) {
        console.error('Error:', err.message);
    }
});
commander_1.program.parse(process.argv);
