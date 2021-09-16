import fs from "fs";
import readline from "readline";

export default function lines(f: string) {
    return readline.createInterface(fs.createReadStream(f));
}
