"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatObject = exports.format = void 0;
const chalk_1 = __importDefault(require("chalk"));
function jsonToTable(data) {
    if (!data) {
        return;
    }
    if (isPrintable(data)) {
        return [["(Value)"], [exports.format(data)]];
    }
    const plainObject = exports.flatObject(data);
    const rows = [["(key)", "(value)"]];
    for (const key in plainObject) {
        rows.push([
            chalk_1.default.green(key), exports.format(plainObject[key])
        ]);
    }
    return rows;
}
exports.default = jsonToTable;
exports.format = (val) => {
    if (!isNaN(val)) {
        return chalk_1.default.yellow(val);
    }
    return val;
};
exports.flatObject = (data) => {
    if (!data) {
        return data;
    }
    if (data.toJSON) {
        return data.toJSON();
    }
    if (isPrintable(data)) {
        return data;
    }
    if (Array.isArray(data) && isPrintableArray(data)) {
        return data.join(", ");
    }
    const out = {};
    for (const key in data) {
        const flatten = exports.flatObject(data[key]);
        if (isPrintable(flatten)) {
            out[key] = flatten;
            continue;
        }
        for (const subkey in flatten) {
            out[`${key}.${subkey}`] = flatten[subkey];
        }
    }
    return out;
};
const isPrintableArray = (items) => !items.some(i => !isPrintable(i));
const isPrintable = (data) => {
    const type = typeof data;
    return type === "string" || type === "number";
};
