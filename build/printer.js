"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = void 0;
const stream_1 = require("stream");
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const yaml_1 = __importDefault(require("yaml"));
function print(data, fileType, filename) {
    if (filename) {
        writeToFile(data, filename, fileType);
        return;
    }
    if (Array.isArray(data)) {
        writeToSTD(data);
        return;
    }
    console.log(data);
}
exports.print = print;
function writeToFile(data, filename, fileType) {
    const ext = path_1.extname(filename);
    if (ext) {
        fileType = ext.substr(1);
    }
    if (fileType === "json") {
        fs_1.writeFileSync(filename, JSON.stringify(data, null, 4));
        return;
    }
    if (fileType === "yaml") {
        fs_1.writeFileSync(filename, yaml_1.default.stringify(data));
        return;
    }
    let text = '';
    if (typeof data === "string" || typeof data === "number") {
        text = String(data);
    }
    else if (Array.isArray(data) && data[0] && typeof data[0] === "string") {
        text = data.join(os_1.EOL);
    }
    else {
        text = JSON.stringify(data);
    }
    fs_1.writeFileSync(filename, text);
}
function writeToSTD(items) {
    const stream = new stream_1.Readable({
        read(bits) {
            if (!items.length) {
                return this.push(null);
            }
            this.push(items.shift() + os_1.EOL);
        }
    });
    stream.on("error", (err) => {
        console.log(err.message);
    });
    stream.pipe(process.stdout).on("error", (e) => {
        console.log(e.message);
    });
}
