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
exports.run = exports.build = void 0;
const lodash_1 = __importDefault(require("lodash"));
const array_1 = __importDefault(require("./array"));
const string_1 = __importDefault(require("./string"));
const obj = __importStar(require("./object"));
const moment_1 = __importDefault(require("moment"));
require("./date");
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
    out = out.replace(/\[(.*?)\]/g, (a, b) => {
        if (!b) {
            return a;
        }
        b = b.trim();
        if (b.startsWith('"') || b.startsWith("'")) {
            return a;
        }
        let args = b.split(",");
        if (args.length === 1 && !args[0].includes(":")) {
            return a;
        }
        args = args.map((x) => {
            if (x.includes(':')) {
                return `'${x}'`;
            }
            return x;
        });
        return `.at(${args})`;
    });
    return out;
};
exports.run = (command, $) => {
    'use string';
    const _ = lodash_1.default;
    const cast = obj.cast;
    const type = obj.type;
    array_1.default();
    string_1.default();
    const date = moment_1.default;
    const values = Object.values;
    const keys = Object.keys;
    return eval(command);
};
