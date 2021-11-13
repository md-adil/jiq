import fs from "fs";
import File from "./file";

export class Directory {
    private queue: fs.Dir[] = [];
    private directory: fs.Dir;
    constructor(path?: string, private isRecursive = false) {
        this.directory = fs.opendirSync(path ?? process.cwd());
    }

    async * [Symbol.asyncIterator]() {
        for await (const f of this.directory) {
            yield new File(f.name);
        }
    }
}

export function directory(loc?: string, isRecursive?: boolean) {
    return new Directory(loc, isRecursive);
}