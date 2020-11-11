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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
const path_1 = require("path");
const parser = __importStar(require("./parser"));
exports.validTypes = ["txt", "json", "yaml", "csv", "xml", "html"];
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
    }
    if (filename) {
        const ext = path_1.extname(filename).substr(1);
        if (!exports.validTypes.includes(ext)) {
            throw new Error(`${ext} is not recognized format`);
        }
        return ext;
    }
    return "txt";
};
const readStream = (cb) => {
    let data = '';
    process.stdin.on("data", (txt) => {
        data += txt.toString();
    });
    process.stdin.on("end", () => cb(data));
    process.stdin.on("error", (err) => {
        console.error(err.message);
    });
};
exports.read = (filename, program, callback) => {
    if (filename && isRemoteFile(filename)) {
        getRemoteData(filename).then((args) => callback(...args));
        return;
    }
    const fileType = getFileType(program, filename);
    if (filename) {
        return callback(fileType, parser.parse(fs_1.default.readFileSync(filename, "utf-8"), fileType));
    }
    readStream((txt) => {
        callback(fileType, parser.parse(txt, fileType));
    });
};
exports.write = (data, filename, fileType) => {
    const ext = path_1.extname(filename);
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
