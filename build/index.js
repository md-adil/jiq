#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
const commander_1 = require("commander");
const path_1 = require("path");
const query_1 = require("./query");
const printer_1 = require("./printer");
const os_1 = require("os");
const yaml_1 = __importDefault(require("yaml"));
const sync_1 = __importDefault(require("csv-parse/lib/sync"));
const validFileTypes = ["txt", "json", "yaml", "csv"];
const getFileType = (filename) => {
    switch (true) {
        case commander_1.program.json:
            return "json";
        case commander_1.program.text:
            return "txt";
        case commander_1.program.yaml:
            return "yaml";
        case commander_1.program.csv:
            return "csv";
    }
    if (filename) {
        const ext = path_1.extname(filename).substr(1);
        if (!validFileTypes.includes(ext)) {
            throw new Error(`${ext} is not recognized format`);
        }
        return ext;
    }
    return "txt";
};
const readStream = async () => {
    let data = '';
    process.stdin.on("data", (txt) => {
        data += txt.toString();
    });
    return new Promise((resolve, reject) => {
        process.stdin.on("end", () => {
            resolve(data);
        }).on("error", (err) => {
            reject(err);
        });
    });
};
const convertTextToData = (content, fileType) => {
    switch (fileType) {
        case "json":
            return JSON.parse(content);
        case "yaml":
            return yaml_1.default.parse(content);
        case "csv":
            return sync_1.default(content, {
                columns: true,
                skipEmptyLines: true
            });
        case "txt":
            return content.split(os_1.EOL);
    }
};
const readContent = (filename, fileType, callback) => {
    let content = '';
    if (filename) {
        content = fs_1.default.readFileSync(filename, "utf-8");
        callback(convertTextToData(content, fileType));
        return;
    }
    readStream().then((txt) => {
        callback(convertTextToData(txt, fileType));
    }).catch(err => {
        console.log(err.message);
    });
};
function main(query, filename) {
    let fileType = getFileType(filename);
    query = query_1.parseCommand(query);
    readContent(filename, fileType, (data) => {
        if (commander_1.program.save) {
            printer_1.writeToFile(query_1.run(query, data, lodash_1.default), commander_1.program.save, fileType);
        }
        else {
            printer_1.print(query_1.run(query, data, lodash_1.default), fileType, commander_1.program.print);
        }
    });
}
;
commander_1.program.version("0.0.3");
commander_1.program
    .option('--json', 'tell the program it\'s json content')
    .option('--text', 'tell the program it\'s text content')
    .option('--yaml', 'tell the program it\'s yaml content')
    .option('--print <format>', 'printer format (table)')
    .option('--save <filename>', 'save output to a file')
    .arguments(`<query> [filename]`)
    .description(`'.name' package.json`)
    .action((query, filename) => {
    main(query, filename);
});
commander_1.program.parse(process.argv);
