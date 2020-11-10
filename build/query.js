"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.build = void 0;
const lodash_1 = __importDefault(require("lodash"));
const cast_1 = __importDefault(require("./cast"));
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
    const values = Object.values;
    const keys = Object.keys;
    Object.defineProperties(String.prototype, {
        uppercase: {
            get() {
                return this.toUpperCase();
            }
        },
        lowercase: {
            get() {
                return this.toLowerCase();
            }
        },
        camelcase: {
            get() {
                return _.camelCase(this);
            }
        },
        upperfirst: {
            get() {
                return _.upperFirst(this);
            }
        },
        capitalize: {
            get() {
                return _.capitalize(this);
            }
        },
        kebabcase: {
            get() {
                return _.kebabCase(this);
            }
        },
        snakecase: {
            get() {
                return _.snakeCase(this);
            }
        },
        limit: {
            value(length, separator) {
                return _.truncate(this, {
                    length, separator
                });
            }
        },
        words: {
            get() {
                return _.words(this);
            }
        }
    });
    Object.defineProperties(Array.prototype, {
        first: {
            get() {
                return _.head(this);
            }
        },
        last: {
            get() {
                return _.last(this);
            }
        },
        head: {
            value(length) {
                return _.take(this, length);
            }
        },
        tail: {
            value(length) {
                return this.slice(this.length - length);
            }
        },
        nth: {
            value(n) {
                return _.nth(this, n);
            }
        },
        pick: {
            value(...args) {
                if (typeof args[0] === "string") {
                    return this.map((item) => _.pick(item, args));
                }
                const picker = args[0];
                return this.map((item) => {
                    const result = {};
                    for (const i in picker) {
                        result[i] = _.get(item, picker[i]);
                    }
                    return result;
                });
            }
        },
        except: {
            value(...args) {
                return this.map((item) => _.omit(item, ...args));
            }
        },
        cast: {
            value(key, castTo) {
                return this.map((item) => cast_1.default(item, key, castTo));
            }
        }
    });
    return eval(command);
};
