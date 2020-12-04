"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.parse = void 0;
const os_1 = require("os");
const yaml_1 = __importDefault(require("yaml"));
const sync_1 = __importDefault(require("csv-parse/lib/sync"));
const sync_2 = __importDefault(require("csv-stringify/lib/sync"));
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const file_1 = __importDefault(require("./file"));
const dotenv_1 = __importDefault(require("dotenv"));
const file_list_1 = __importDefault(require("./file-list"));
exports.parse = (content, fileType) => {
    switch (fileType) {
        case "json":
            return JSON.parse(content);
        case "yaml":
        case "yml":
            return yaml_1.default.parse(content);
        case "csv":
            return sync_1.default(content, {
                columns: true,
                bom: true,
                skipEmptyLines: true,
            });
        case "xml":
            return fast_xml_parser_1.default.parse(content, { ignoreAttributes: false });
        case "html":
            return require("./html").default(content);
        case "file": {
            const paths = content.split(os_1.EOL);
            const fileList = new file_list_1.default();
            paths.forEach(p => {
                fileList.push(new file_1.default(p));
            });
            return fileList;
        }
        case "env":
            return dotenv_1.default.parse(content);
        default:
            return content;
    }
};
exports.stringify = (data, fileType) => {
    switch (fileType) {
        case "json":
            return JSON.stringify(data, null, 4);
        case "yaml":
            return yaml_1.default.stringify(data);
        case "csv":
            return sync_2.default(data, {
                header: true
            });
        case "xml": {
            const parser = new fast_xml_parser_1.default.j2xParser({ ignoreAttributes: false });
            return parser.parse(data);
        }
        case "txt":
            return data.join(os_1.EOL);
        default:
            return JSON.stringify(data, null, 4);
    }
};
