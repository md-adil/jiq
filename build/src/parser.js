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
exports.stringify = exports.parse = void 0;
const os_1 = require("os");
const yaml_1 = __importDefault(require("yaml"));
const sync_1 = __importDefault(require("csv-parse/lib/sync"));
const sync_2 = __importDefault(require("csv-stringify/lib/sync"));
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const file_1 = __importDefault(require("./file"));
const file_list_1 = __importDefault(require("./file-list"));
exports.parse = (content, fileType) => {
    switch (fileType) {
        case "json":
            return JSON.parse(content);
        case "yaml":
            return yaml_1.default.parse(content);
        case "csv":
            return sync_1.default(content, {
                columns: true,
                bom: true,
                skipEmptyLines: true,
            });
        case "xml":
            return fast_xml_parser_1.default.parse(content, { ignoreAttributes: false });
        case "txt":
            return content.split(os_1.EOL);
        case "html": {
            Promise.resolve().then(() => __importStar(require("./html"))).then(c => c.default(content));
            // return require("./html")(content);
        }
        case "file":
            const paths = content.split(os_1.EOL);
            if (paths.length === 1) {
                return new file_list_1.default(new file_1.default(paths[0]));
            }
            const fileList = new file_list_1.default();
            paths.forEach(p => {
                fileList.push(new file_1.default(p));
            });
            return fileList;
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
