import lodash, { LoDashStatic } from "lodash";
import cheerio from "cheerio";

export const build = (command: string) => {
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
}

export const run = (command: string, $: any ) => {
    'use string';
    const _ = lodash;
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
        head: {
            value(length: number) {
                return _.take(this, length)
            }
        },
        tail: {
            value(length: number) {
                return this.slice(this.length - length);
            }
        },
        nth: {
            value(n: number) {
                return _.nth(this, n);
            }
        },
        pick: {
            value(...args: string[]) {
                return this.map((item: any) => _.pick(item, args));
            }
        },
        except: {
            value(...args: string[]) {
                return this.map((item: any) => _.omit(item, ...args));
            }
        }
    });

    
    // cheerio.prototype.pick = function pick(...args: any) {
    //     const $ = this;
    //     if (args.length === 1) {
    //         if (typeof args[0] === 'string') {
    //             const [ tag, attr ] = args[0].split(':');
    //             return this.map(function(i: number, x: any) {
    //                return $.find.bind(x)(tag).attr("href");
    //             });
    //         }
    //     }
    // }
    return eval(command);
}
