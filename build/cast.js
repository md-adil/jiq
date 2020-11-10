"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const presets = {
    number: parseInt,
    string: String
};
function cast(data, key, castTo) {
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
        lodash_1.default.set(data, i, cast(lodash_1.default.get(data, key), key[i]));
    }
    return data;
}
exports.default = cast;
