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
exports.write = exports.read = exports.validTypes = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const path_2 = require("path");
const parser = __importStar(require("./parser"));
const file_list_1 = __importDefault(require("./file-list"));
const os_1 = require("os");
exports.validTypes = ["text", "txt", "json", "yaml", "yml", "csv", "xml", "html", "file"];
const getFileType = (program, filename) => {
    switch (true) {
        case program.json:
            return "json";
        case program.text:
            return "txt";
        case program.yaml:
            return "yaml";
        case program.csv:
            return "csv";
        case program.html:
            return "html";
        case program.file:
            return "file";
    }
    if (!filename) {
        return "txt";
    }
    const stats = fs_1.default.statSync(path_1.default.resolve(filename));
    if (stats.isDirectory()) {
        return "file";
    }
    let ext = path_2.extname(filename);
    if (!ext) {
        return "txt";
    }
    ext = ext.substr(1);
    return ext;
};
const readStream = (cb) => {
    let data = '';
    process.stdin.on("data", (txt) => {
        data += txt.toString();
    });
    process.stdin.on("end", () => {
        if (data.endsWith(os_1.EOL)) {
            data = data.slice(0, -1);
        }
        cb(data);
    });
    process.stdin.on("error", (err) => {
        console.error(err.message);
    });
};
exports.read = (filename, program, callback) => {
    if (!filename) {
        const fileType = getFileType(program);
        return readStream((txt) => {
            callback(fileType, parser.parse(txt, fileType));
        });
    }
    if (isRemoteFile(filename)) {
        getRemoteData(filename).then((args) => callback(...args));
        return;
    }
    const fileType = getFileType(program, filename);
    if (fileType === "file") {
        return callback(fileType, file_list_1.default.create(filename));
    }
    return callback(fileType, parser.parse(readFile(filename), fileType));
};
const readFile = (filename) => {
    let contents = fs_1.default.readFileSync(filename, "utf-8");
    if (contents.endsWith(os_1.EOL)) {
        contents = contents.slice(0, -1);
    }
    return contents;
};
exports.write = (data, filename, fileType) => {
    const ext = path_2.extname(filename);
    if (ext) {
        fileType = ext.substr(1);
    }
    fs_1.default.writeFileSync(filename, parser.stringify(data, fileType));
};
const isRemoteFile = (filename) => {
    return /^https?\:\/\//.test(filename);
};
const getRemoteData = async (url) => {
    const response = await node_fetch_1.default(url);
    const contentType = response.headers.get("Content-Type");
    const fileType = getFileFromContentType(contentType);
    return [fileType, parser.parse(await response.text(), fileType)];
};
const getFileFromContentType = (contentType) => {
    if (!contentType) {
        return "txt";
    }
    const ext = contentType.split(';')[0];
    if (!ext) {
        return "txt";
    }
    return ext.split("/")[1];
};
