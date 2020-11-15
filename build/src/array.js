"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRange = exports.picker = void 0;
const lodash_1 = __importDefault(require("lodash"));
const object_1 = require("./object");
exports.picker = (...fields) => {
    let out = {};
    if (typeof fields[0] === "string") {
        for (const field of fields) {
            out[field] = (data) => lodash_1.default.get(data, field);
        }
        return out;
    }
    if (Array.isArray(fields[0])) {
        const keys = fields[0];
        for (let i = 0; i < keys.length; i++) {
            if (!keys[i]) {
                continue;
            }
            out[keys[i]] = (data) => data[i];
        }
        return out;
    }
    out = fields[0];
    for (const field in out) {
        const callback = out[field];
        if (typeof callback === "string") {
            out[field] = (data) => lodash_1.default.get(data, callback);
        }
    }
    return out;
};
function array() {
    Object.defineProperties(Array.prototype, {
        first: {
            get() {
                return lodash_1.default.head(this);
            }
        },
        last: {
            get() {
                return lodash_1.default.last(this);
            }
        },
        head: {
            value(length) {
                return this.slice(0, length);
            }
        },
        tail: {
            value(length) {
                return this.slice(this.length - length);
            }
        },
        pick: {
            value(...args) {
                if (typeof args[0] === "string") {
                    return this.map((item) => lodash_1.default.pick(item, args));
                }
                const pick = exports.picker(args[0]);
                return this.map((item) => {
                    const result = {};
                    for (const i in pick) {
                        const key = pick[i];
                        result[i] = key(item);
                    }
                    return result;
                });
            }
        },
        except: {
            value(...args) {
                return this.map((item) => lodash_1.default.omit(item, ...args));
            }
        },
        cast: {
            value(key, castTo) {
                return object_1.cast(this, key, castTo);
            }
        },
        pluck: {
            value(key, val) {
                if (typeof val === "function") {
                    return this.reduce((prev, current) => (prev[lodash_1.default.get(current, key)] = val(current), prev), {});
                }
                if (val === ".") {
                    return this.reduce((prev, current) => (prev[lodash_1.default.get(current, key)] = current, prev), {});
                }
                if (val !== undefined) {
                    return this.reduce((prev, current) => (prev[lodash_1.default.get(current, key)] = lodash_1.default.get(current, val), prev), {});
                }
                return this.map((item) => lodash_1.default.get(item, key));
            }
        },
        each: {
            value(callback) {
                this.forEach(callback);
                return this;
            }
        },
        at: {
            value(...args) {
                if (!this.length) {
                    return;
                }
                let out = new this.constructor;
                if ("headers" in this) {
                    out.headers = this.headers;
                }
                for (const arg of args) {
                    if (typeof arg === "number") {
                        out.push(lodash_1.default.nth(this, arg));
                        continue;
                    }
                    const [from, to] = exports.parseRange(arg.split(':'), this.length);
                    for (let x = from; x <= to; x++) {
                        out.push(this[x]);
                    }
                }
                return out;
            }
        }
    });
}
exports.default = array;
exports.parseRange = ([x, y], length) => {
    let from = x ? parseInt(x) : 0;
    let to = y ? parseInt(y) : length - 1;
    if (from < 0) {
        from = length + from;
    }
    if (from < 0) {
        from = 0;
    }
    if (to < 0) {
        to = length + to - 1;
    }
    if (to < from) {
        throw new Error("Invalid range, to must be less than from");
    }
    return [from, to];
};
