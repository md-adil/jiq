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
const validPrinters = ["json", "table", "txt", "yaml", "xml"];
function print(data, fileType, printer) {
    if (printer && !validPrinters.includes(printer)) {
        throw new Error(`${printer} is invalid printer, valid printers are ( ${validPrinters.join(' / ')} )`);
    }
    switch (printer) {
        case "table":
            return console.table(data);
        case "json":
            process.stdout.write(util_1.default.inspect(data, false, null, true));
            process.stdout.write(os_1.EOL);
            return;
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
            process.stdout.write(util_1.default.inspect(data, false, null, true));
            process.stdout.write(os_1.EOL);
            return;
        case "txt":
            return writeToStdout(data);
    }
    console.log(data);
}
exports.print = print;
const printXML = (data) => {
    const parser = new fast_xml_parser_1.default.j2xParser({ ignoreAttributes: false, format: true });
    console.log(parser.parse(data));
};
function writeToStdout(items) {
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
}
