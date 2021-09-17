import { Readable } from "stream";
import path from "path";
import fs from "fs";
import File from "./file";
import { filesize } from "./humanize";
import chalk from "chalk";
import type FileType from "./file";
import { humanize } from "./date";
import moment from "moment";
import { EOL } from "os";

type Header = {
    [key: string]: (file: File) => string;
};

export class Directory extends Readable {
    queue: fs.Dir[] = [];
    directory: fs.Dir;
    constructor(path: string, private isRecursive = false) {
        super({ objectMode: true });
        this.directory = fs.opendirSync(path);
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
        },
    };

    async _read() {
        let directory = this.directory;
        if (!this.isRecursive) {
            const file = await directory.read();
            if (!file) {
                this.push(file);
                return;
            }
            this.push(new File(path.join(directory.path, file.name)));
            return;
        }
        let fromQueue = false;
        if (this.queue.length > 0) {
            directory = this.queue[0];
            fromQueue = true;
        }
        const file = await directory.read();
        if (!file) {
            if (fromQueue) {
                this.queue.shift();
                this._read();
            } else {
                this.push(null);
            }
            return;
        }
        if (file.isDirectory()) {
            try {
                this.queue.push(fs.opendirSync(path.join(directory.path, file.name)));
                await this._read();
            } catch (err) {
                // do nothing
            }
            return;
        }
        this.push(new File(path.join(directory.path, file.name)));
    }

    toTable(file: FileType) {
        function format(x: keyof File, value: string, file: File) {
            switch (x) {
                case "size":
                    if (file.isDirectory) {
                        return chalk.green("--");
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
                        return [chalk.strikethrough.yellow(value), file.renamed].join(EOL);
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
        const row: string[] = [];
        for (const x of headers) {
            const callback = this.headers[x];
            row.push(format(x as any, callback(file), file));
        }
        return row;
    }
}
