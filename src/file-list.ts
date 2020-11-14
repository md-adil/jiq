import path from "path";
import fs from "fs";
import File from "./file";
import { filesize } from "./humanize";
import chalk from "chalk";
import { EOL } from "os";
import _ from "lodash";
import { Moment } from "moment";

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

    printableHeaders = {
        base(x: string, file: File) {
            return x;
        },
        type(x: string, file: File) {
            return x;
        },
        size(x: number, file: File) {
            return filesize(x);
        },
        date(x: Moment | string, file: File) {
            if (typeof x === "string") {
                return x;
            }
            return x.format("MMM D, YYYY");
        }
    }

    pick(...args: any[]) {
        let headers: any = {};
        if (typeof args[0] === "string") {
            for (const arg of args) {
                if ((this.printableHeaders as any)[arg]) {
                    headers[arg] = (this.printableHeaders as any)[arg];
                    continue;
                }
                headers[arg] = (x: string) => x;
            }
            this.printableHeaders = headers;
            return this;
        }
        headers = args[0];
        for (const i in headers) {
            if (typeof headers[i] === "string") {
                headers[i] = (x: any) => x;
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
            delete (this.printableHeaders as any)[a];
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
        function getRow(x: string, callback: (d: any, file: File) => any, file: File) {
            switch(x) {
                case "size":
                    if (file.isDirectory) {
                        return chalk.green('--');
                    }
                    return chalk.green(callback(file.size, file));
                case "type":
                    return chalk.magenta(file.type);
                case "base":
                    if (file.renamed) {
                        return chalk.strikethrough.yellow(callback(
                            `${file.base}${EOL}${file.renamed}`, file
                        ));
                    }
                    if (file.deleted) {
                        return chalk.strikethrough.red(file.base);
                    }
                    return chalk.blue(file.base);
                case "date":
                    return chalk.yellow(callback(file.date, file));
                default:
                    return callback((file as any)[x], file);
            }
        }
        const headers = Object.keys(this.printableHeaders);
        const rows = this.map(file => {
            const row: string[] = [];
            for (const x of headers) {
                const callback = (this.printableHeaders as any)[x];
                row.push(
                    getRow(x, callback, file)
                );
            }
            return row;
        });
        return [ headers, ...rows ];
    }

    toJSON() {
        const headers = this.printableHeaders as any;
        return this.map(file => {
            const row: any = {};
            for (const x in headers) {
                const callback = headers[x];
                row[x] = callback((file as any)[x], file);
            }
            return row;
        });
    }
}

export default FileList;
