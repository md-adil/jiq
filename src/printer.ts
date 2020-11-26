import { Readable } from "stream";
import { EOL } from "os";
import YAML from "yaml";
import util from "util";
import type { FileType } from "./io";
import XML from "fast-xml-parser";
import { table, getBorderCharacters } from "table";
import File from "./file";
import FileList from "./file-list";
import _ from "lodash";
import jsonToTable, { format } from "./json-to-table";

const validPrinters = [ "json", "table", "txt", "yaml", "xml" ] as const;
export type PrinterTypes = typeof validPrinters[number];

export function print(data: any, fileType: FileType, printer?: PrinterTypes): void {
    if (printer && !validPrinters.includes(printer)) {
        throw new Error(`${printer} is invalid printer, valid printers are ( ${validPrinters.join(' / ')} )`);
    }
    switch(printer) {
        case "table":
            return printTable(data);
        case "json":
            return printJSON(data);
        case "yaml":
            process.stdout.write(YAML.stringify(data));
            process.stdout.write(EOL);
            return;
        case "xml":
            return printXML(data);
        case "txt":
            return printText(data);
    }

    switch(fileType) {
        case "csv":
            return printCSV(data);
        case "yaml":
        case "yml":
            process.stdout.write(YAML.stringify(data));
            process.stdout.write(EOL);
            return;
        case "json":
            return printJSON(data);
        case "txt":
        case "text":
            return printText(data);
        case "file":
            return printFile(data);
        case "html":
            return printHTML(data);
    }
    console.log(data);
}

const printJSON = (data: any) => {
    if (data.toJSON && typeof data.toJSON === "function") {
        data = data.toJSON();
    }
    process.stdout.write(util.inspect(data, false, null, true));
    process.stdout.write(EOL);
    return;
}

const printFile = (data: FileList | File) => {
    if (data instanceof File) {
        data = new FileList(data);
    }
    printTable(data);
}

const printTable = (data: any, isRaw = false) => {
    if (data && data.toTable) {
        isRaw = true;
        data = data.toTable();
    }

    if (!isRaw) {
        if (Array.isArray(data)) {
            return console.table(data);
        }
        data = jsonToTable(data);
    }
    if (!data) {
        return;
    }

    process.stdout.write(
        table(data as any, {
            border: getBorderCharacters("norc"),
            drawHorizontalLine(x, size) {
                return x == 0 || x === 1 || x == size;
            }
        })
    );
    process.stdout.write(EOL);
}

const printHTML = (data: any) => {
    if (!data || !data.toTable) {
        return console.log(data);
    }
    return printTable(data);
}

const printXML = (data: any) => {
    const parser = new XML.j2xParser({ ignoreAttributes: false, format: true });
    console.log(parser.parse(data));
}

function printText(items: string | (string | number)[]) {
    if (["string", "number"].includes(typeof items)) {
        process.stdout.write(items.toString());
        process.stdout.write(EOL);
        return;
    }
    printTable(items as any);
}

const printCSV = (data: any) => {
    if (!Array.isArray(data)) {
        return printTable(data);
    }
    const header = Object.keys(data[0]);
    const tableData = [ header ];
    for (const row of data) {
        tableData.push(
            header.map(head => format(row[head]))
        )
    }
    printTable(tableData, true);
}
