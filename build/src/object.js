"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.type = exports.cast = void 0;
const lodash_1 = __importDefault(require("lodash"));
const presets = {
    number: parseInt,
    string: String
};
function cast(data, key, castTo) {
    if (Array.isArray(data)) {
        const newData = new data.constructor;
        if ("headers" in data) {
            newData.headers = data.headers;
        }
        for (const row of data) {
            newData.push(cast(row, key, castTo));
        }
        return newData;
    }
    if (typeof key === "function") {
        return key(data);
    }
    if (typeof key === "string" && !castTo) {
        if (key in presets) {
            return presets[key](data);
        }
        return data[key];
    }
    if (typeof key === "string" && castTo) {
        lodash_1.default.set(data, key, cast(lodash_1.default.get(data, key), castTo));
        return data;
    }
    for (const i in key) {
        lodash_1.default.set(data, i, cast(lodash_1.default.get(data, i), key[i]));
    }
    return data;
}
exports.cast = cast;
const typesMapping = {
    Number: "number",
    String: "string",
    Array: "array",
    Moment: "date",
    Object: "object"
};
function type(data) {
    if (!data) {
        throw new Error("Cannot read type of undefined");
    }
    return typesMapping[data.constructor.name] || data.constructor.name;
}
exports.type = type;
