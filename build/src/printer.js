"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const json_to_table_1 = __importStar(require("./json-to-table"));
const validPrinters = ["json", "table", "txt", "yaml", "xml"];
function print(data, fileType, printer) {
    if (printer && !validPrinters.includes(printer)) {
        throw new Error(`${printer} is invalid printer, valid printers are ( ${validPrinters.join(' / ')} )`);
    }
    switch (printer) {
        case "table":
            return printTable(data);
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
            return printCSV(data);
        case "yaml":
        case "yml":
            process.stdout.write(yaml_1.default.stringify(data));
            process.stdout.write(os_1.EOL);
        case "json":
            return printJSON(data);
        case "txt":
        case "text":
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
    printTable(data);
};
const printTable = (data, isRaw = false) => {
    if (data && data.toTable) {
        isRaw = true;
        data = data.toTable();
    }
    if (!isRaw) {
        if (Array.isArray(data)) {
            return console.table(data);
        }
        data = json_to_table_1.default(data);
    }
    if (!data) {
        return;
    }
    process.stdout.write(table_1.table(data, {
        border: table_1.getBorderCharacters("norc"),
        drawHorizontalLine(x, size) {
            return x == 0 || x === 1 || x == size;
        }
    }));
    process.stdout.write(os_1.EOL);
};
const printHTML = (data) => {
    if (!data || !data.toTable) {
        return console.log(data);
    }
    return printTable(data);
};
const printXML = (data) => {
    const parser = new fast_xml_parser_1.default.j2xParser({ ignoreAttributes: false, format: true });
    console.log(parser.parse(data));
};
function writeToStdout(items) {
    if (Array.isArray(items) && typeof items[0] === "string") {
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
    printTable(items);
}
const printCSV = (data) => {
    if (!Array.isArray(data)) {
        return printTable(data);
    }
    const header = Object.keys(data[0]);
    const tableData = [header];
    for (const row of data) {
        tableData.push(header.map(head => json_to_table_1.format(row[head])));
    }
    printTable(tableData, true);
};
