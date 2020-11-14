"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const file_1 = __importDefault(require("./file"));
const humanize_1 = require("./humanize");
const chalk_1 = __importDefault(require("chalk"));
const os_1 = require("os");
class FileList extends Array {
    constructor() {
        super(...arguments);
        this.printableHeaders = {
            base(x, file) {
                return x;
            },
            type(x, file) {
                return x;
            },
            size(x, file) {
                return humanize_1.filesize(x);
            },
            date(x, file) {
                if (typeof x === "string") {
                    return x;
                }
                return x.format("MMM D, YYYY");
            }
        };
    }
    static create(loc) {
        const fullpath = path_1.default.resolve(loc);
        const stats = fs_1.default.statSync(fullpath);
        if (stats.isFile()) {
            return new file_1.default(loc, stats);
        }
        if (stats.isDirectory()) {
            const contents = fs_1.default.readdirSync(fullpath);
            const files = new FileList();
            for (const p of contents) {
                try {
                    const stats = fs_1.default.statSync(path_1.default.resolve(loc, p));
                    files.push(new file_1.default(path_1.default.join(loc, p), stats));
                }
                catch (err) {
                }
            }
            return files;
        }
        throw new Error("Not a valid file");
    }
    pick(...args) {
        let headers = {};
        if (typeof args[0] === "string") {
            for (const arg of args) {
                if (this.printableHeaders[arg]) {
                    headers[arg] = this.printableHeaders[arg];
                    continue;
                }
                headers[arg] = (x) => x;
            }
            this.printableHeaders = headers;
            return this;
        }
        headers = args[0];
        for (const i in headers) {
            if (typeof headers[i] === "string") {
                headers[i] = (x) => x;
            }
        }
        this.printableHeaders = headers;
        return this;
    }
    clone(files) {
        const fileList = new FileList(...files);
        fileList.printableHeaders = this.printableHeaders;
        return fileList;
    }
    except(...args) {
        for (const a of args) {
            delete this.printableHeaders[a];
        }
        return this;
    }
    map(callbackfn, thisArg) {
        const out = [];
        for (let i = 0; i < this.length; i++) {
            out.push(callbackfn(this[i], i, this));
        }
        return out;
    }
    toTable() {
        function getRow(x, callback, file) {
            switch (x) {
                case "size":
                    if (file.isDirectory) {
                        return chalk_1.default.green('--');
                    }
                    return chalk_1.default.green(callback(file.size, file));
                case "type":
                    return chalk_1.default.magenta(file.type);
                case "base":
                    if (file.renamed) {
                        return chalk_1.default.strikethrough.yellow(callback(`${file.base}${os_1.EOL}${file.renamed}`, file));
                    }
                    if (file.deleted) {
                        return chalk_1.default.strikethrough.red(callback(file.base, file));
                    }
                    return chalk_1.default.blue(callback(file.base, file));
                case "date":
                    return chalk_1.default.yellow(callback(file.date, file));
                default:
                    return callback(file[x], file);
            }
        }
        const headers = Object.keys(this.printableHeaders);
        const rows = this.map(file => {
            const row = [];
            for (const x of headers) {
                const callback = this.printableHeaders[x];
                row.push(getRow(x, callback, file));
            }
            return row;
        });
        return [headers, ...rows];
    }
    toJSON() {
        const headers = this.printableHeaders;
        return this.map(file => {
            const row = {};
            for (const x in headers) {
                const callback = headers[x];
                row[x] = callback(file[x], file);
            }
            return row;
        });
    }
}
exports.default = FileList;
