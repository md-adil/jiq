import { Readable } from "stream";
import path from "path";
import fs from "fs";

export class Directory extends Readable {
    private isRecursive = false;
    queue: fs.Dir[] = [];
    directory: fs.Dir;
    constructor(path: string) {
        super({ objectMode: true });
        this.directory = fs.opendirSync(path);
    }
    async _read() {
        let directory = this.directory;
        if (!this.isRecursive) {
            const file = await directory.read();
            if (!file) {
                this.push(file);
                return;
            }
            this.push({ name: file.name, path: path.join(directory.path, file.name) });
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
            this.queue.push(fs.opendirSync(path.join(directory.path, file.name)));
            await this._read();
            return;
        }
        this.push({ name: file.name, path: path.join(directory.path, file.name) });
    }
}

(async () => {
    const directory = new Directory("./src");
    directory.on("data", ({ path }) => {
        console.log(path);
    });
})();

export {};
