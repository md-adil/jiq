#!/usr/bin/node
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
const validFileTypes = ["txt", "json", "yaml"];
const getFileType = (filename) => {
    switch (true) {
        case commander_1.program.json:
            return "json";
        case commander_1.program.text:
            return "txt";
        case commander_1.program.yaml:
            return "yaml";
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
            throw new Error("Not implemented yet");
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
        printer_1.print(query_1.run(query, data, lodash_1.default), fileType, commander_1.program.save);
    });
}
;
commander_1.program.version("0.0.1");
commander_1.program
    .option('--json', 'JSON type')
    .option('--text', 'Text type')
    .option('--yaml', 'YAML type')
    .option('--save <filename>', 'Filename to save')
    .arguments(`<query> [filename]`)
    .description(`'.name' package.json`)
    .action((query, filename) => {
    main(query, filename);
});
commander_1.program.parse(process.argv);
