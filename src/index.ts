import type { Command } from "commander";
import * as query from "./query";
import * as printer from "./printer";
import * as io from "./io";
import chalk from "chalk";

const isPiped = !process.stdin.isTTY;

export function main(program: Command, filename?: string, rawQuery?: string) {
    if (isPiped) {
        rawQuery = filename || "$";
        filename = undefined;
    } else {
        filename = filename || ".";
        rawQuery = rawQuery || "$";
    }
    try {
        const commands = query.build(rawQuery);
        io.read(filename, program, (fileType: io.FileType, data) => {
            if (program.save) {
                io.write(query.run(commands, data), program.save, fileType);
            } else {
                printer.print(query.run(commands, data), fileType, program.print);
            }
        });
    } catch (err: any) {
        console.error(chalk.red(err.message));
    }
}
