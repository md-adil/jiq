import * as parser from "./parser";
import fs from "fs";
import { extname } from "path";

export const validTypes = [ "txt", "json", "yaml", "csv", "xml", "html" ] as const;
export type FileType = typeof validTypes[number];

export const getFileType = (program: any, filename?: string): FileType => {
    switch(true) {
        case program.json:
            return "json";
        case program.text:
            return "txt";
        case program.yaml:
            return "yaml";
        case program.csv:
            return "csv";
        case program.html:
            return "html";
    }
    if (filename) {
        const ext = extname(filename).substr(1);
        if (!validTypes.includes(ext as any)) {
            throw new Error(`${ext} is not recognized format`);
        }
        return ext as FileType;
    }
    return "txt";
}

const readStream = (cb: (str: string) => void) => {
    let data = '';
    process.stdin.on("data", (txt) => {
        data += txt.toString();
    });
    process.stdin.on("end", () => cb(data));
    process.stdin.on("error", (err) => {
        console.error(err.message);
    });
}

export const read = (filename: string | undefined, fileType: FileType, callback: (data: any) => void): void => {
    if (filename) {
        return callback(parser.parse(fs.readFileSync(filename, "utf-8"), fileType));
    }
    readStream((txt) => {
        callback(parser.parse(txt, fileType));
    });
}

export const write = (data: any, filename: string, fileType: FileType) => {
    const ext = extname(filename);
    if (ext) {
        fileType = ext.substr(1) as FileType;
    }
    fs.writeFileSync(filename, parser.stringify(data, fileType));
}
