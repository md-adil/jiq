import { Readable } from "stream";
import { EOL } from "os";
import YAML from "yaml";
import util from "util";
import type { FileType } from "./file";
import XML from "fast-xml-parser";

const validPrinters = [ "json", "table", "txt", "yaml", "xml" ] as const;
export type PrinterTypes = typeof validPrinters[number];

export function print(data: any, fileType: FileType, printer?: PrinterTypes): void {
    if (printer && !validPrinters.includes(printer)) {
        throw new Error(`${printer} is invalid printer, valid printers are ( ${validPrinters.join(' / ')} )`);
    }
    switch(printer) {
        case "table":
            return console.table(data);
        case "json":
            process.stdout.write(util.inspect(data, false, null, true));
            process.stdout.write(EOL);
            return;
        case "yaml":
            process.stdout.write(YAML.stringify(data));
            process.stdout.write(EOL);
            return;
        case "xml":
            return printXML(data);
        case "txt":
            return writeToStdout(data);
    }

    switch(fileType) {
        case "csv":
            return console.table(data);
        case "json":
            process.stdout.write(util.inspect(data, false, null, true));
            process.stdout.write(EOL);
            return;
        case "txt":
            return writeToStdout(data);
    }
    console.log(data);
}

const printXML = (data: any) => {
    const parser = new XML.j2xParser({ ignoreAttributes: false });
    console.log(parser.parse(data));
}

function writeToStdout(items: (string | number)[]) {
    const stream = new Readable({
        read(bits) {
            if (!items.length) {
                return this.push(null);
            }
            this.push(items.shift() + EOL);
        },
    });
    stream.on("error", (err) => {
        console.log(err.message);
    });
    stream.pipe(process.stdout).on("error", (e) => {
        console.log(e.message);
    });
}
