"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const object_1 = require("./object");
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
                const picker = args[0];
                return this.map((item) => {
                    const result = {};
                    for (const i in picker) {
                        const key = picker[i];
                        if (typeof key === "function") {
                            result[i] = key(item);
                            continue;
                        }
                        result[i] = lodash_1.default.get(item, picker[i]);
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
                let out = new this.constructor;
                for (const arg of args) {
                    if (typeof arg === "number") {
                        out.push(lodash_1.default.nth(this, arg));
                        continue;
                    }
                    const [from, to] = parseRange(arg.split(':'), this.length);
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
const parseRange = ([x, y], length) => {
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
