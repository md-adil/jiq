import fs from "fs";
import path from "path";
import _ from "lodash";
import moment, { Moment, relativeTimeRounding } from "moment";
import {lookup} from "mime-types";
export default class File {

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
    
    get modified() {
        return moment(this.stats.atime);
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
        if (this.stats.isFile()) {
            return true;
        }
        return false;
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
        return lookup(this.location) || "unknown";
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