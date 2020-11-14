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
const moment_1 = __importDefault(require("moment"));
const date_1 = require("./date");
class FileList extends Array {
    constructor() {
        super(...arguments);
        this.printableHeaders = {
            base(file) {
                return file.base;
            },
            type(file) {
                return file.type;
            },
            size(file) {
                return humanize_1.filesize(file.size);
            },
            date(file) {
                if (typeof file.date === "string") {
                    return file.date;
                }
                return file.date.format("MMM D, YYYY");
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
                headers[arg] = function (key, file) {
                    return file[key];
                }.bind(this, arg);
            }
            this.printableHeaders = headers;
            return this;
        }
        headers = args[0];
        for (const i in headers) {
            if (typeof headers[i] === "string") {
                headers[i] = function (key, file) {
                    return file[key];
                }.bind(this, headers[i]);
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
    append(...args) {
        for (const arg of args) {
            this.printableHeaders[arg] = (file) => file[arg];
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
        function format(x, value, file) {
            switch (x) {
                case "size":
                    if (file.isDirectory) {
                        return chalk_1.default.green('--');
                    }
                    return chalk_1.default.green(value);
                case "type":
                    return chalk_1.default.magenta(value);
                case "name":
                case "location":
                case "base":
                    if (file.renamed) {
                        return [
                            chalk_1.default.strikethrough.yellow(value),
                            file.renamed
                        ].join(os_1.EOL);
                    }
                    if (file.deleted) {
                        return chalk_1.default.strikethrough.red(value);
                    }
                    return chalk_1.default.blue(value);
                case "date":
                    return chalk_1.default.yellow(value);
                default:
                    if (moment_1.default.isMoment(value)) {
                        return chalk_1.default.yellow(date_1.humanize(value));
                    }
                    return value;
            }
        }
        const headers = Object.keys(this.printableHeaders);
        const rows = this.map(file => {
            const row = [];
            for (const x of headers) {
                const callback = this.printableHeaders[x];
                row.push(format(x, callback(file), file));
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
                row[x] = callback(file);
            }
            return row;
        });
    }
}
exports.default = FileList;
