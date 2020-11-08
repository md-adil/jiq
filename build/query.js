"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.parseCommand = void 0;
exports.parseCommand = (command) => {
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
exports.run = (command, $, _) => {
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
        }
    });
    return eval(command);
};
