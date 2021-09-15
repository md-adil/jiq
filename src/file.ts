import fs from "fs";
import path from "path";
import _ from "lodash";
import moment, { Moment } from "moment";
import { execSync } from "child_process";
import { lookup } from "mime-types";
import { EOL } from "os";
export default class File {
    static groups = new Map<number, string>();
    public readonly name: string;
    public readonly ext: string;
    public readonly base: string;
    public readonly date: Moment;
    public readonly type: string;
    public readonly size: number;
    public readonly stats: fs.Stats;
    public readonly pathInfo: path.ParsedPath;
    public readonly location: string;
    public isDeleted = false;
    public renamed?: string;
    private _isReadable?: boolean;

    constructor(base: string, stats?: fs.Stats) {
        this.base = base;
        this.location = path.resolve(base);
        const pathInfo = path.parse(base);
        if (!stats) {
            stats = fs.statSync(path.resolve(base));
        }
        this.stats = stats;
        this.ext = pathInfo.ext.substr(1);
        this.name = pathInfo.name;
        this.pathInfo = pathInfo;
        this.type = this.fetchType(pathInfo, stats);
        this.size = this.getSize(stats);
        this.date = moment(stats.birthtime);
    }

    get directory() {
        return path.dirname(this.base);
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
        return moment(this.stats.mtime);
    }

    get accessed() {
        return moment(this.stats.atime);
    }

    get group() {
        const id = this.stats.gid;
        if (!File.groups.has(id)) {
            const name = execSync(`grep ':${id}:' /etc/group | cut -d ':' -f 1`).toString().trim();
            File.groups.set(id, name);
        }
        return File.groups.get(id)!;
    }

    get owner() {
        return `${this.user}/${this.group}`;
    }

    get user() {
        return execSync(`id -un ${this.stats.uid}`).toString().trim();
    }

    get read() {
        if (this.isDirectory) {
            return;
        }
        return fs.readFileSync(this.base, "utf-8");
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

    getSize(stats: fs.Stats) {
        if (stats.isDirectory()) {
            return -1;
        }
        return stats.size;
    }

    rename(...args: string[]) {
        return this.move(this.directory, args.join("."));
    }

    move(...args: string[]) {
        const name = path.join(...args);
        if (this.base === name) {
            return this;
        }
        this.renamed = name;
        fs.renameSync(this.base, name);
        return this;
    }

    update(...contents: string[]) {
        fs.writeFileSync(this.location, contents.join(EOL));
        return this;
    }

    fetchType(info: path.ParsedPath, stats: fs.Stats): string {
        if (stats.isDirectory()) {
            return "directory";
        }
        if (!stats.isFile()) {
            return "unknown";
        }
        return lookup(this.location) || this.ext;
    }

    get isHidden() {
        return this.name.startsWith(".");
    }

    get delete() {
        fs.unlinkSync(this.base);
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
        return fs.readdirSync(this.base);
    }

    get isEmpty() {
        if (this.stats.isDirectory()) {
            return this.readdir.length === 0;
        }
        return this.size === 0;
    }

    copy(name: string, flags?: number) {
        fs.copyFileSync(this.base, name, flags);
        return name;
    }

    toJSON() {
        return { ..._.pick(this, ["base", "type", "size", "date"]) };
    }

    toString() {
        return this.base;
    }
}
