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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const query = __importStar(require("./query"));
const printer = __importStar(require("./printer"));
const io = __importStar(require("./io"));
const chalk_1 = __importDefault(require("chalk"));
const { version } = require('../../package.json');
const isPiped = !process.stdin.isTTY;
function main(filename, rawQuery) {
    if (isPiped) {
        rawQuery = filename || '$';
        filename = undefined;
    }
    else {
        filename = filename || '.';
        rawQuery = rawQuery || '$';
    }
    const commands = query.build(rawQuery);
    io.read(filename, commander_1.program, (fileType, data) => {
        if (commander_1.program.save) {
            io.write(query.run(commands, data), commander_1.program.save, fileType);
        }
        else {
            printer.print(query.run(commands, data), fileType, commander_1.program.print);
        }
    });
}
;
commander_1.program.version(version);
commander_1.program
    .option('--json', 'tell the program it\'s json content')
    .option('--text', 'tell the program it\'s text content')
    .option('--yaml', 'tell the program it\'s yaml content')
    .option('--html', 'tell the program it\'s html content')
    .option('--file', 'tell the program it\'s file type')
    .option('--print <format>', 'printer format (table)')
    .option('--save <filename>', 'save output to a file')
    .arguments(`[filename] [query]`)
    .description(`'.name' package.json`)
    .action((query, filename) => {
    try {
        main(query, filename);
    }
    catch (err) {
        console.error(chalk_1.default.red(err.message));
    }
});
commander_1.program.parse(process.argv);
