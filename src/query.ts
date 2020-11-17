import lodash from "lodash";
import array from "./array";
import string from "./string";
import * as obj from "./object";
import moment from "moment";
import "./date";

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

    out = out.replace(/\[(.*?)\]/g, (a, b) => {
        if (!b) {
            return a;
        }
        b = b.trim();
        if (b.startsWith('"') || b.startsWith("'")) {
            return a;
        }
        let args = b.split(",");
        if (args.length === 1 && !args[0].includes(":")) {
            return a;
        }
        args = args.map((x: string) => {
            if (x.includes(':')) {
                return `'${x}'`;
            }
            return x;
        })
        return `.at(${args})`;
    });
    return out;
}

export const run = (command: string, $: any ) => {
    'use string';
    const _ = lodash;
    const cast = obj.cast;
    const type = obj.type;
    array();
    string();
    const date = moment;
    const values = Object.values;
    const keys = Object.keys;
    return eval(command);
}
