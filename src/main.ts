import { program } from "commander";
import * as query from "./query";
import * as printer from "./printer";
import * as io from "./io";

const isPiped = !process.stdin.isTTY;

export function main(filename?: string, rawQuery?: string) {
    if (isPiped) {
        rawQuery = filename || "$";
        filename = undefined;
    } else {
        filename = filename || ".";
        rawQuery = rawQuery || "$";
    }
    const commands = query.build(rawQuery);
    io.read(filename, program, (fileType: io.FileType, data) => {
        if (program.save) {
            io.write(query.run(commands, data), program.save, fileType);
        } else {
            printer.print(query.run(commands, data), fileType, program.print);
        }
    });
}
