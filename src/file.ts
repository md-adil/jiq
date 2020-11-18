import fs from "fs";
import path from "path";
import _ from "lodash";
import moment, { Moment } from "moment";
import { execSync } from "child_process";
import {lookup} from "mime-types";
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
    public deleted = false;
    public renamed ?: string;
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
        this.name = pathInfo.name
        this.pathInfo = pathInfo;
        this.type = this.fetchType(pathInfo, stats);
        this.size = this.getSize(stats);
        this.date = moment(stats.birthtime);
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
        if (File.groups.has(id)) {
            return File.groups.get(id)!;
        }
        const name = execSync(`getent group ${id} | cut -d: -f1`).toString().trim();
        File.groups.set(id, name);
        return name;
    }

    get owner() {
        return `${this.user}/${this.group}`;
    }

    get user() {
        return execSync(`id -un ${this.stats.uid}`).toString().trim();
    }

    getSize(stats: fs.Stats) {
        if (stats.isDirectory()) {
            return 0;
        }
        return stats.size;
    }

    get read() {
        if (!this.readable) {
            return null;
        }
        return fs.readFileSync(this.base, "utf-8");
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

    rename(name: string) {
        this.renamed = name;
        fs.renameSync(this.base, name);
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

    get hidden() {
        return this.name.startsWith('.');
    }

    get delete() {
        fs.unlinkSync(this.base)
        this.deleted = true;
        return true;
    }

    get isDirectory() {
        return this.stats.isDirectory();
    }

    get empty() {
        if (this.stats.isDirectory()) {
            return fs.readdirSync(this.location).length === 0;
        }
        return this.size === 0;
    }
   
    toJSON() {
        return { ..._.pick(this, [ "base", "type", "size" ]) };
    }

    toString() {
        return this.name;
    }
}
