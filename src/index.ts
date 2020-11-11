#!/usr/bin/env node
import { program } from "commander";
import * as query from "./query";
import * as printer from "./printer";
import * as file from "./file";

function main(rawQuery: string, filename?: string) {
    const commands = query.build(rawQuery);
    file.read(filename, program, (fileType: file.FileType, data) => {
        if (program.save) {
            file.write(query.run(commands, data), program.save, fileType);
        } else {
            printer.print(query.run(commands, data), fileType, program.print);
        }
    });
};

program.version("0.0.4");
program
    .option('--json', 'tell the program it\'s json content')
    .option('--text', 'tell the program it\'s text content')
    .option('--yaml', 'tell the program it\'s yaml content')
    .option('--html', 'tell the program it\'s html content')
    .option('--print <format>', 'printer format (table)')
    .option('--save <filename>', 'save output to a file')
    .arguments(`<query> [filename]`)
    .description(`'.name' package.json`)
    .action((query, filename) => {
        try {
            main(query, filename);
        } catch(err) {
            console.error('Error:', err.message);
        }
    });

program.parse(process.argv);
