#!/usr/bin/node
import fs from "fs";
import _ from "lodash";
import { program } from "commander";
import { extname } from "path";
import { parseCommand, run } from "./query";
import { print } from "./printer";
import { EOL } from "os";

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
            throw new Error("Not implemented yet");
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
        print(run(query, data, _), fileType, program.save);
    });
};

program.version("0.0.1");
program
    .option('--json', 'JSON type')
    .option('--text', 'Text type')
    .option('--yaml', 'YAML type')
    .option('--save <filename>', 'Filename to save')
    .arguments(`<query> [filename]`)
    .description(`'.name' package.json`)
    .action((query, filename) => {
        main(query, filename);
    });

program.parse(process.argv);
