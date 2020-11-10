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

export const read = (filename: string | undefined, fileType: FileType, callback: (data: any) => void) => {
    if (filename) {
        callback(parser.parse(fs.readFileSync(filename, "utf-8"), fileType));
        return;
    }
    readStream().then((txt) => {
        callback(parser.parse(txt, fileType));
    }).catch(err => {
        console.error(err.message);
    })
}

export const write = (data: any, filename: string, fileType: FileType) => {
    const ext = extname(filename);
    if (ext) {
        fileType = ext.substr(1) as FileType;
    }
    fs.writeFileSync(filename, parser.stringify(data, fileType));
}
