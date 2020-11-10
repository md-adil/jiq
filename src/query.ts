import lodash from "lodash";
import array from "./array";
import string from "./string";

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
    array();
    string();
    const values = Object.values;
    const keys = Object.keys;
    return eval(command);
}
