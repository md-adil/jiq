"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const presetCasts = {
    number: parseInt,
    string: String
};
function cast(data, key, castTo) {
    if (typeof key === "function") {
        return key(data);
    }
    if (typeof key === "string") {
        if (castTo) {
            if (typeof castTo === "string") {
                if (!(castTo in presetCasts)) {
                    throw new Error("Invalid casting " + castTo);
                }
                castTo = presetCasts[castTo];
            }
            lodash_1.default.set(data, key, castTo(lodash_1.default.get(data, key)));
            return data;
        }
        if (!(key in presetCasts)) {
            throw new Error("Invalid casting " + key);
        }
        const caster = presetCasts[key];
        return caster(data);
    }
    for (const i in key) {
        if (typeof key[i] === "string") {
            if (!(key[i] in presetCasts)) {
                throw new Error("invalid casting " + key[i]);
            }
            key[i] = presetCasts[key[i]];
        }
        lodash_1.default.set(data, i, key[i](lodash_1.default.get(data, i)));
    }
    return data;
}
exports.default = cast;
