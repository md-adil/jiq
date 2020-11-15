"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const child_process_1 = require("child_process");
const mime_types_1 = require("mime-types");
class File {
    constructor(base, stats) {
        this.deleted = false;
        this.base = base;
        this.location = path_1.default.resolve(base);
        const pathInfo = path_1.default.parse(base);
        if (!stats) {
            stats = fs_1.default.statSync(path_1.default.resolve(base));
        }
        this.stats = stats;
        this.ext = pathInfo.ext.substr(1);
        this.name = pathInfo.name;
        this.pathInfo = pathInfo;
        this.type = this.fetchType(pathInfo, stats);
        this.size = this.getSize(stats);
        this.date = moment_1.default(stats.birthtime);
    }
    get created() {
        return this.date;
    }
    get uid() {
        return this.stats.uid;
    }
    get gid() {
        return this.stats.gid;
    }
    get modified() {
        return moment_1.default(this.stats.mtime);
    }
    get accessed() {
        return moment_1.default(this.stats.atime);
    }
    get group() {
        const id = this.stats.gid;
        if (File.groups.has(id)) {
            return File.groups.get(id);
        }
        const name = child_process_1.execSync(`getent group ${id} | cut -d: -f1`).toString().trim();
        File.groups.set(id, name);
        return name;
    }
    get owner() {
        return `${this.user}/${this.group}`;
    }
    get user() {
        return child_process_1.execSync(`id -un ${this.stats.uid}`).toString().trim();
    }
    getSize(stats) {
        if (stats.isDirectory()) {
            return 0;
        }
        return stats.size;
    }
    get read() {
        if (!this.readable) {
            return null;
        }
        return fs_1.default.readFileSync(this.base, "utf-8");
    }
    get readable() {
        if (typeof this._isReadable !== 'undefined') {
            return this._isReadable;
        }
        if (this.stats.isDirectory()) {
            this._isReadable = false;
            return false;
        }
        if (this.stats.isFile()) {
            this._isReadable = true;
            return true;
        }
        this._isReadable = false;
        return this._isReadable;
    }
    rename(name) {
        this.renamed = name;
        fs_1.default.renameSync(this.base, name);
        return this;
    }
    fetchType(info, stats) {
        if (stats.isDirectory()) {
            return "directory";
        }
        if (!stats.isFile()) {
            return "unknown";
        }
        return mime_types_1.lookup(this.location) || this.ext;
        ;
    }
    get hidden() {
        return this.name.startsWith('.');
    }
    get delete() {
        fs_1.default.unlinkSync(this.base);
        this.deleted = true;
        return true;
    }
    get isDirectory() {
        return this.stats.isDirectory();
    }
    get empty() {
        if (this.stats.isDirectory()) {
            return fs_1.default.readdirSync(this.location).length === 0;
        }
        return this.size === 0;
    }
    toJSON() {
        return { ...lodash_1.default.pick(this, ["base", "type", "size"]) };
    }
    toString() {
        return this.name;
    }
}
exports.default = File;
File.groups = new Map();