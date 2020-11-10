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
exports.write = exports.read = exports.getFileType = exports.validTypes = void 0;
const parser = __importStar(require("./parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
exports.validTypes = ["txt", "json", "yaml", "csv", "xml", "html"];
exports.getFileType = (program, filename) => {
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
const readStream = async () => {
    let data = '';
    process.stdin.on("data", (txt) => {
        data += txt.toString();
    });
    return new Promise((resolve, reject) => {
        process.stdin.on("end", () => {
            resolve(data);
        }).on("error", (err) => {
            reject(err);
        });
    });
};
exports.read = (filename, fileType, callback) => {
    if (filename) {
        callback(parser.parse(fs_1.default.readFileSync(filename, "utf-8"), fileType));
        return;
    }
    readStream().then((txt) => {
        callback(parser.parse(txt, fileType));
    }).catch(err => {
        console.error(err.message);
    });
};
exports.write = (data, filename, fileType) => {
    const ext = path_1.extname(filename);
    if (ext) {
        fileType = ext.substr(1);
    }
    fs_1.default.writeFileSync(filename, parser.stringify(data, fileType));
};
