#!/usr/bin/env node
import { program } from "commander";
import * as query from "./query";
import * as printer from "./printer";
import * as io from "./io";
import chalk from "chalk";
const { version } = require('../../package.json');

const isPiped = !process.stdin.isTTY;

function main(filename?: string, rawQuery?: string) {
    if (isPiped) {
        rawQuery = filename || '$';
        filename = undefined;
    } else {
        filename = filename || '.';
        rawQuery = rawQuery || '$';
    }
    const commands = query.build(rawQuery);
    io.read(filename, program, (fileType: io.FileType, data) => {
        if (program.save) {
            io.write(query.run(commands, data), program.save, fileType);
        } else {
            printer.print(query.run(commands, data), fileType, program.print);
        }
    });
};

program.version(version);
program
    .option('--json', 'tell the program it\'s json content')
    .option('-r, --recursive', 'recursive files')
    .option('--text', 'tell the program it\'s text content')
    .option('--yaml', 'tell the program it\'s yaml content')
    .option('--html', 'tell the program it\'s html content')
    .option('--file', 'tell the program it\'s file type')
    .option('--csv', 'tell the program it\'s csv type')
    .option('--print <format>', 'printer format (table)')
    .option('--save <filename>', 'save output to a file')
    .arguments(`[filename] [query]`)
    .description(`'.name' package.json`)
    .action((query, filename) => {
        try {
            main(query, filename);
        } catch(err) {
            console.error(chalk.red(err.message));
        }
    });

program.parse(process.argv);
