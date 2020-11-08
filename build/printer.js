"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToFile = exports.print = void 0;
const stream_1 = require("stream");
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const yaml_1 = __importDefault(require("yaml"));
const util_1 = __importDefault(require("util"));
function print(data, fileType, printer) {
    if (printer === "table") {
        console.table(data);
        return;
    }
    if (printer === "json") {
        process.stdout.write(util_1.default.inspect(data, false, null, true));
        process.stdout.write(os_1.EOL);
        return;
    }
    if (printer === "yaml") {
        process.stdout.write(yaml_1.default.stringify(data));
        process.stdout.write(os_1.EOL);
        return;
    }
    if (fileType === "csv") {
        console.table(data);
        return;
    }
    if (fileType === "txt") {
        writeToStdout(data);
        return;
    }
    process.stdout.write(util_1.default.inspect(data, false, null, true));
    process.stdout.write(os_1.EOL);
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
    let text = "";
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
exports.writeToFile = writeToFile;
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
