"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const cast_1 = __importDefault(require("./cast"));
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
                return lodash_1.default.take(this, length);
            }
        },
        tail: {
            value(length) {
                return this.slice(this.length - length);
            }
        },
        nth: {
            value(n) {
                return lodash_1.default.nth(this, n);
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
                return this.map((item) => cast_1.default(item, key, castTo));
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
        get: {
            value(...args) {
                if (args.length === 1 && typeof args[0] === "number") {
                    return this[args[0]];
                }
                let out = [];
                for (const arg of args) {
                    if (typeof arg === "number") {
                        out.push(this[arg]);
                        continue;
                    }
                    const [from, to] = arg.split(':');
                    for (let x = from ? parseInt(from) : 0; x <= (to ? parseInt(to) : this.length - 1); x++) {
                        out.push(this[x]);
                    }
                }
                return out;
            }
        }
    });
}
exports.default = array;
