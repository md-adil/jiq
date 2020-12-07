import path from "path";
import fs from "fs";
import File from "./file";
import { filesize } from "./humanize";
import chalk from "chalk";
import { EOL } from "os";
import _ from "lodash";
import moment from "moment";
import { humanize } from "./date";
import { picker } from "./array";

const walk = (loc: string, files = new FileList()) => {
    const stats = fs.statSync(loc);
    if (stats.isDirectory()) {
        try {
            for(const l of fs.readdirSync(path.resolve(loc))) {
                walk(path.join(loc, l), files);
            }
        } catch(err) {
            console.error(chalk.red(err.message));
        }
    } else {
        files.push(new File(loc, stats));
    }
    return files;
}

type Header = {
    [key: string]: (file: File) => string;
}

class FileList extends Array<File> {
    static create(loc: string, isRecursive = false): FileList | File {
        if (isRecursive) {
            return walk(loc);
        }
        const fullpath = path.resolve(loc);
        const stats = fs.statSync(fullpath);
        if (stats.isDirectory()) {
            try {
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
            } catch(err) {
                console.error(chalk.red(err.message));
            }
        }
        return new File(loc, stats);
    }

    headers: Header = {
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
            return file.date as any;
        }
    }

    sortingPresets: {[key: string]: (a: File, b: File) => number } = {
        latest(a, b) {
            return b.created.unix() - a.created.unix();
        },
        oldest(a, b) {
            return a.created.unix() - b.created.unix();
        },
        recent(a, b) {
            return b.modified.unix() - a.modified.unix();
        },
        smallest(a, b) {
            return a.size - b.size;
        },
        largest(a, b) {
            return b.size - a.size
        }
    }

    pick(...args: any[]) {
        this.headers = picker(...args);
        return this;
    }

    sort(compareFn?: string | (((a: File, b: File) => number) | undefined), asc = "asc") {
        if (typeof compareFn === "string") {
            if (compareFn in this.sortingPresets) {
                this.sort(this.sortingPresets[compareFn]);
                return this;
            }
            if (compareFn === "latest") {
                this.sort((x, y) => {
                    return (y as any).date - (x as any).date;
                });
                return this;
            }

            if (asc === "asc") {
                this.sort((x, y) => {
                    return (y as any)[compareFn] - (x as any)[compareFn];
                });
            } else {
                this.sort((x, y) => {
                    return (x as any)[compareFn] - (y as any)[compareFn];
                });
            }
            return this;
        }
        if (typeof compareFn === "function") {
            return super.sort(compareFn);
        }
        return this;
    }

    clone(files: File[]): FileList {
        const fileList = new FileList(...files);
        fileList.headers = this.headers;
        return fileList;
    }

    except(...args: string[]) {
        for (const a of args) {
            delete this.headers[a];
        }
        return this;
    }

    append(...args: string[]) {
        Object.assign(this.headers, picker(...args));
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
                    if (value === "directory") {
                        return chalk.magenta.bold(value);
                    }
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
                    if (file.isDeleted) {
                        return chalk.strikethrough.red(value);
                    }
                    return chalk.blueBright(value);
                default:
                    if (moment.isMoment(value)) {
                        return chalk.yellow(humanize(value));
                    }
                    return value;
            }
        }
        const headers = Object.keys(this.headers);
        const rows = this.map(file => {
            const row: string[] = [];
            for (const x of headers) {
                const callback = this.headers[x];
                row.push(format(x as any, callback(file), file));
            }
            return row;
        });
        return [ headers, ...rows ];
    }

    toJSON() {
        const headers = this.headers;
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
