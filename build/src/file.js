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
const os_1 = require("os");
class File {
    constructor(base, stats) {
        this.isDeleted = false;
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
        if (!File.groups.has(id)) {
            const name = child_process_1.execSync(`grep ':${id}:' /etc/group | cut -d ':' -f 1`).toString().trim();
            File.groups.set(id, name);
        }
        return File.groups.get(id);
    }
    get owner() {
        return `${this.user}/${this.group}`;
    }
    get user() {
        return child_process_1.execSync(`id -un ${this.stats.uid}`).toString().trim();
    }
    get read() {
        if (this.isDirectory) {
            return;
        }
        return fs_1.default.readFileSync(this.base, "utf-8");
    }
    get files() {
        if (!this.isDirectory) {
            return;
        }
        return require("./file-list").default.create(this.base);
    }
    get isReadable() {
        return this.isFile;
    }
    getSize(stats) {
        if (stats.isDirectory()) {
            return -1;
        }
        return stats.size;
    }
    rename(name) {
        this.renamed = name;
        fs_1.default.renameSync(this.base, name);
        return this;
    }
    update(...contents) {
        fs_1.default.writeFileSync(this.location, contents.join(os_1.EOL));
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
    }
    get isHidden() {
        return this.name.startsWith('.');
    }
    get delete() {
        fs_1.default.unlinkSync(this.base);
        this.isDeleted = true;
        return true;
    }
    get isDirectory() {
        return this.stats.isDirectory();
    }
    get isFile() {
        return this.stats.isFile();
    }
    get readdir() {
        return fs_1.default.readdirSync(this.base);
    }
    get isEmpty() {
        if (this.stats.isDirectory()) {
            return this.readdir.length === 0;
        }
        return this.size === 0;
    }
    copy(name, flags) {
        fs_1.default.copyFileSync(this.base, name, flags);
        return name;
    }
    toJSON() {
        return { ...lodash_1.default.pick(this, ["base", "type", "size", "date"]) };
    }
    toString() {
        return this.base;
    }
}
exports.default = File;
File.groups = new Map();
