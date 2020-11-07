#!/usr/bin/node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const lodash_1 = __importDefault(require("lodash"));
const stream_1 = require("stream");
const argv = process.argv.splice(2);
function stdWrite(items) {
    const stream = new stream_1.Readable({
        read(bits) {
            if (!items.length) {
                return this.push(null);
            }
            this.push(items.shift() + os_1.default.EOL);
        }
    });
    stream.on("error", (err) => {
        console.log(err.message);
    });
    stream.pipe(process.stdout).on("error", (e) => {
        console.log(e.message);
    });
}
const parseCommand = (command) => {
    if (!command) {
        throw new Error('No a valid command found');
    }
    let out = '';
    if (command[0] === '.') {
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
function run(command, $, _) {
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
        nth: {
            value(n) {
                return _.nth(this, n);
            }
        }
    });
    print(eval(command));
}
function print(data) {
    if (Array.isArray(data)) {
        stdWrite(data);
    }
    else {
        console.log(data);
    }
}
(async function () {
    'use strict';
    let [command, filename] = argv;
    command = parseCommand(command);
    if (!filename) {
        throw new Error('Filename not found');
    }
    const $ = JSON.parse(fs_1.default.readFileSync(filename, "utf-8"));
    run(command, $, lodash_1.default);
})();
