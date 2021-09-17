import { Transform } from "stream";
import File from "../file";
import { Directory } from "../directory";

export class FilePrinter extends Transform {
    constructor(public readonly dir: Directory) {
        super({ objectMode: true });
    }
    _transform(file: File, _: string, callback: () => void) {
        this.push(this.dir.toTable(file));
        callback();
    }
}
