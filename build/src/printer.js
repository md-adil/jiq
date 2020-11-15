"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = void 0;
const stream_1 = require("stream");
const os_1 = require("os");
const yaml_1 = __importDefault(require("yaml"));
const util_1 = __importDefault(require("util"));
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const table_1 = require("table");
const file_1 = __importDefault(require("./file"));
const file_list_1 = __importDefault(require("./file-list"));
const validPrinters = ["json", "table", "txt", "yaml", "xml"];
function print(data, fileType, printer) {
    if (printer && !validPrinters.includes(printer)) {
        throw new Error(`${printer} is invalid printer, valid printers are ( ${validPrinters.join(' / ')} )`);
    }
    switch (printer) {
        case "table":
            return console.table(data);
        case "json":
            return printJSON(data);
        case "yaml":
            process.stdout.write(yaml_1.default.stringify(data));
            process.stdout.write(os_1.EOL);
            return;
        case "xml":
            return printXML(data);
        case "txt":
            return writeToStdout(data);
    }
    switch (fileType) {
        case "csv":
            return console.table(data);
        case "json":
            return printJSON(data);
        case "txt":
            return writeToStdout(data);
        case "file":
            return printFile(data);
        case "html":
            return printHTML(data);
    }
    console.log(data);
}
exports.print = print;
const printJSON = (data) => {
    if (data.toJSON && typeof data.toJSON === "function") {
        data = data.toJSON();
    }
    process.stdout.write(util_1.default.inspect(data, false, null, true));
    process.stdout.write(os_1.EOL);
    return;
};
const printFile = (data) => {
    if (data instanceof file_1.default) {
        data = new file_list_1.default(data);
    }
    if (!(data instanceof file_list_1.default)) {
        return console.table(data);
    }
    console.log(table_1.table(data.toTable(), {
        border: table_1.getBorderCharacters("norc"),
        drawHorizontalLine(x, size) {
            return x == 0 || x === 1 || x == size;
        }
    }));
    return;
};
const printHTML = (data) => {
    if (!data || !data.toTable) {
        return console.log(data);
    }
    const out = table_1.table(data.toTable(), {
        border: table_1.getBorderCharacters("norc"),
        drawHorizontalLine(x, size) {
            return x == 0 || x === 1 || x == size;
        }
    });
    console.log(out);
};
const printXML = (data) => {
    const parser = new fast_xml_parser_1.default.j2xParser({ ignoreAttributes: false, format: true });
    console.log(parser.parse(data));
};
function writeToStdout(items) {
    if (Array.isArray(items)) {
        const stream = new stream_1.Readable({
            read(bits) {
                if (!items.length) {
                    return this.push(null);
                }
                this.push(items.shift() + os_1.EOL);
            },
        });
        stream.on("error", (err) => {
            console.log(err.message);
        });
        stream.pipe(process.stdout).on("error", (e) => {
            console.log(e.message);
        });
        return;
    }
    console.log(items);
}
