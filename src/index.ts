#!/usr/bin/env node

import fs from "fs";
import _ from "lodash";
import { program } from "commander";
import { extname } from "path";
import { parseCommand, run } from "./query";
import { print, writeToFile } from "./printer";
import { EOL } from "os";
import YAML from "yaml";

const validFileTypes = [ "txt", "json", "yaml" ] as const;
export type FileType = typeof validFileTypes[number];
const getFileType = (filename?: string): FileType => {
    switch(true) {
        case program.json:
            return "json";
        case program.text:
            return "txt";
        case program.yaml:
            return "yaml";
    }
    if (filename) {
        const ext = extname(filename).substr(1);
        if (!validFileTypes.includes(ext as any)) {
            throw new Error(`${ext} is not recognized format`);
        }
        return ext as FileType;
    }
    return "txt";
}

const readStream = async () => {
    let data = '';
    process.stdin.on("data", (txt) => {
        data += txt.toString();
    });
    return new Promise<string>((resolve, reject) => {
        process.stdin.on("end", () => {
            resolve(data);
        }).on("error", (err) => {
            reject(err);
        });
    });
}

const convertTextToData = (content: string, fileType: FileType) => {
    switch(fileType) {
        case "json":
            return JSON.parse(content);
        case "yaml":
            return YAML.parse(content);
        case "txt":
            return content.split(EOL);
    }
};

const readContent = (filename: string | undefined, fileType: FileType, callback: (data: any) => void) => {
    let content = '';
    if (filename) {
        content = fs.readFileSync(filename, "utf-8");
        callback(convertTextToData(content, fileType));
        return;
    }
    readStream().then((txt) => {
        callback(convertTextToData(txt, fileType));
    }).catch(err => {
        console.log(err.message);
    })
}

function main(query: string, filename?: string) {
    let fileType = getFileType(filename);
    query = parseCommand(query);
    readContent(filename, fileType, (data) => {
        if (program.save) {
            writeToFile(run(query, data, _), program.save, fileType);
        } else {
            print(run(query, data, _), fileType, program.print);
        }
    });
};

program.version("0.0.3");
program
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

program.parse(process.argv);
