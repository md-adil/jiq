"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.build = void 0;
const lodash_1 = __importDefault(require("lodash"));
const array_1 = __importDefault(require("./array"));
const string_1 = __importDefault(require("./string"));
exports.build = (command) => {
    let out = '';
    if (command[0] === '.' || command[0] === '[') {
        command = '$' + command;
    }
    for (let fn of command.split('|')) {
        fn = fn.trim();
        if (!fn) {
            continue;
        }
        if (!out) {
            out = fn;
            continue;
        }
        if (fn[0] === '.' || fn[0] === '[') {
            out += fn;
            continue;
        }
        out = `${fn}(${out})`;
    }
    return out;
};
exports.run = (command, $) => {
    'use string';
    const _ = lodash_1.default;
    array_1.default();
    string_1.default();
    const values = Object.values;
    const keys = Object.keys;
    return eval(command);
};
