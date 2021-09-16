import { Duplex } from "stream";

class Map extends Duplex {
    constructor() {
        super({ objectMode: true });
    }
    _read() {}
}

export default function map(...args: any[]) {
    return new Map(...args);
}
