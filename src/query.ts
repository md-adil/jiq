import { LoDashStatic } from "lodash";

export const parseCommand = (command: string) => {
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

export const run = (command: string, $: any, _: LoDashStatic) => {
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
    return eval(command);
}
