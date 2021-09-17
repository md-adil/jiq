import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { extname } from "path";
import * as parser from "./parser";
import FileList from "./file-list";
import { EOL } from "os";
import { Directory } from "./directory";

export const validTypes = ["text", "txt", "json", "yaml", "yml", "csv", "xml", "html", "file", "env"] as const;
export type FileType = typeof validTypes[number];

const getFileType = (program: any, filename?: string): FileType => {
    switch (true) {
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
        case program.file:
            return "file";
    }

    if (!filename) {
        return "txt";
    }
    const stats = fs.statSync(path.resolve(filename));
    if (stats.isDirectory()) {
        return "file";
    }
    if (filename.startsWith(".env")) {
        return "env";
    }

    let ext = extname(filename);
    if (!ext) {
        return "txt";
    }
    ext = ext.substr(1);
    return ext as FileType;
};

const readStream = (cb: (str: string) => void) => {
    let data = "";
    process.stdin.on("data", (txt) => {
        data += txt.toString();
    });
    process.stdin.on("end", () => {
        if (data.endsWith(EOL)) {
            data = data.slice(0, -1);
        }
        cb(data);
    });
    process.stdin.on("error", (err) => {
        console.error(err.message);
    });
};

export const read = (filename: string | undefined, program: any, callback: (fileType: FileType, data: any) => void): void => {
    if (!filename) {
        const fileType = getFileType(program);
        return readStream((txt) => {
            callback(fileType, parser.parse(txt, fileType));
        });
    }

    if (isRemoteFile(filename)) {
        getRemoteData(filename).then((args) => callback(...args));
        return;
    }
    const fileType = getFileType(program, filename);
    if (fileType === "file") {
        return callback(fileType, new Directory(filename, program.recursive));
    }
    return callback(fileType, parser.parse(readFile(filename), fileType));
};

const readFile = (filename: string) => {
    let contents = fs.readFileSync(filename, "utf-8");
    if (contents.endsWith(EOL)) {
        contents = contents.slice(0, -1);
    }
    return contents;
};

export const write = (data: any, filename: string, fileType: FileType) => {
    const ext = extname(filename);
    if (ext) {
        fileType = ext.substr(1) as FileType;
    }
    fs.writeFileSync(filename, parser.stringify(data, fileType));
};

const isRemoteFile = (filename: string) => {
    return /^https?\:\/\//.test(filename);
};

const getRemoteData = async (url: string) => {
    const response = await fetch(url);
    const contentType = response.headers.get("Content-Type");
    const fileType = getFileFromContentType(contentType);
    return [fileType, parser.parse(await response.text(), fileType)] as const;
};

const getFileFromContentType = (contentType: string | null): FileType => {
    if (!contentType) {
        return "txt";
    }
    const ext = contentType.split(";")[0];
    if (!ext) {
        return "txt";
    }
    return ext.split("/")[1] as FileType;
};
