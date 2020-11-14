import path from "path";
import fs from "fs";
import File from "./file";
import { filesize } from "./humanize";
import chalk from "chalk";
import { EOL } from "os";
import _ from "lodash";
import moment, { Moment } from "moment";
import { humanize } from "./date";

type PrintableHeader = {
    [key: string]: (file: File) => string;
}

class FileList extends Array<File> {
    static create(loc: string): FileList | File {
        const fullpath = path.resolve(loc);
        const stats = fs.statSync(fullpath);
        if (stats.isFile()) {
            return new File(loc, stats);
        }
        if (stats.isDirectory()) {
            const contents = fs.readdirSync(fullpath);
            const files = new FileList();
            for (const p of contents) {
                try {
                    const stats = fs.statSync(path.resolve(loc, p));
                    files.push(new File(path.join(loc, p), stats));
                } catch(err) {
                }
            }
            return files;
        }
        throw new Error("Not a valid file");
    }

    printableHeaders: PrintableHeader = {
        base(file: File) {
            return file.base;
        },
        type(file: File) {
            return file.type;
        },
        size(file: File) {
            return filesize(file.size);
        },
        date(file: File) {
            if (typeof file.date === "string") {
                return file.date;
            }
            return file.date.format("MMM D, YYYY");
        }
    }

    pick(...args: any[]) {
        let headers: any = {};
        if (typeof args[0] === "string") {
            for (const arg of args) {
                if (this.printableHeaders[arg as keyof File]) {
                    headers[arg] = (this.printableHeaders as any)[arg];
                    continue;
                }
                headers[arg] = function(key: keyof File, file: File) {
                    return file[key];
                }.bind(this, arg);
            }
            this.printableHeaders = headers;
            return this;
        }
        headers = args[0];
        for (const i in headers) {
            if (typeof headers[i] === "string") {
                headers[i] = function(key: keyof File, file: File) {
                    return file[key];
                }.bind(this, headers[i])
            }
        }
        this.printableHeaders = headers;
        return this;
    }

    clone(files: File[]): FileList {
        const fileList = new FileList(...files);
        fileList.printableHeaders = this.printableHeaders;
        return fileList;
    }

    except(...args: string[]) {
        for (const a of args) {
            delete this.printableHeaders[a];
        }
        return this;
    }

    append(...args: string[]) {
        for (const arg of args) {
            this.printableHeaders[arg] = (file: File) => (file as any)[arg];
        }
        return this;
    }

    map<U>(callbackfn: (value: File, index: number, array: File[]) => U, thisArg?: any): U[] {
        const out: U[] = [];
        for (let i = 0; i < this.length; i++) {
            out.push(
                callbackfn(this[i], i, this)
            )
        }
        return out;
    }

    toTable() {
        function format(x: keyof File, value: string, file: File) {
            switch(x) {
                case "size":
                    if (file.isDirectory) {
                        return chalk.green('--');
                    }
                    return chalk.green(value);
                case "type":
                    return chalk.magenta(value);
                case "name":
                case "location":
                case "base":
                    if (file.renamed) {
                        return [
                            chalk.strikethrough.yellow(value),
                            file.renamed
                        ].join(EOL);
                    }
                    if (file.deleted) {
                        return chalk.strikethrough.red(value);
                    }
                    return chalk.blue(value);
                case "date":
                    return chalk.yellow(value);
                default:
                    if (moment.isMoment(value)) {
                        return chalk.yellow(humanize(value));
                    }
                    return value;
            }
        }
        const headers = Object.keys(this.printableHeaders);
        const rows = this.map(file => {
            const row: string[] = [];
            for (const x of headers) {
                const callback = this.printableHeaders[x];
                row.push(format(x as any, callback(file), file));
            }
            return row;
        });
        return [ headers, ...rows ];
    }

    toJSON() {
        const headers = this.printableHeaders;
        return this.map(file => {
            const row: Record<string, string> = {};
            for (const x in headers) {
                const callback = headers[x];
                row[x] = callback(file);
            }
            return row;
        });
    }
}

export default FileList;