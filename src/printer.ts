import { Readable } from "stream";
import {writeFileSync} from "fs";
import { EOL } from "os";
import type { FileType } from "./index";
import { extname } from "path";
export function print(data: any, fileType: FileType, filename?: string) {
    if (filename) {
        writeToFile(data, filename, fileType);
        return;
    }
    if (Array.isArray(data)) {
        writeToSTD(data);
        return;
    }
    console.log(data);
}

function writeToFile(data: any, filename: string, fileType: FileType) {
    const ext = extname(filename);
    if (ext) {
        fileType = ext.substr(1) as FileType;
    }
    if (fileType === "json") {
        writeFileSync(filename, JSON.stringify(data, null, 4));
        return;
    }
    if (fileType === "yaml") {
       throw new Error('Not implemented yet.');
    }
    let text = '';
    if (typeof data === "string" || typeof data === "number") {
        text = String(data);
    }
    else if (Array.isArray(data) && data[0] && typeof data[0] === "string") {
        text = data.join(EOL);
    }
    else {
        text = JSON.stringify(data);
    }
    writeFileSync(filename, text);
}

function writeToSTD(items: (string|number)[]) {
    const stream = new Readable({
        read(bits) {
            if (!items.length) {
                return this.push(null)
            }
            this.push(items.shift() + EOL);
        }
    });
    stream.on("error", (err) => {
        console.log(err.message);
    });
    stream.pipe(process.stdout).on("error", (e) => {
        console.log(e.message);
    });
}
