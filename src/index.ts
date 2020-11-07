#!/usr/bin/node
import fs from "fs";
import os from "os";
import _, { LoDashStatic } from "lodash";
import { Readable } from "stream";
const argv = process.argv.splice(2);

function stdWrite(items: (string|number)[]) {
    const stream = new Readable({
        read(bits) {
            if (!items.length) {
                return this.push(null)
            }
            this.push(items.shift() + os.EOL);
        }
    });
    stream.on("error", (err) => {
        console.log(err.message);
    });
    stream.pipe(process.stdout).on("error", (e) => {
        console.log(e.message);
    });
}

const parseCommand = (command: string) => {
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
}

function run(command: string, $: any, _: LoDashStatic) {
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
                return _.camelCase(this)
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
            value(length?: number, separator?: string) {
                return _.truncate(this, {
                    length, separator
                })
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
            value(n: number) {
                return _.nth(this, n);
            }
        }
    })
    print(eval(command));
}

function print(data: any) {
    if (Array.isArray(data)) {
        stdWrite(data);
    } else {
        console.log(data);
    }
}


(async function() {
    'use strict'
    let [ command, filename ] = argv;
    command = parseCommand(command);
    if (!filename) {
        throw new Error('Filename not found');
    }
    const $ = JSON.parse(fs.readFileSync(filename, "utf-8"));
    run(command, $, _);
})();
