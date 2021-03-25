import lodash from "lodash";
import moment from "moment";
import _ from "lodash";
import array from "./array";
import string, {helpers as stringHelpers} from "./string";
import * as obj from "./object";
import "./date";
import filesystem from "./filesystem";
import os from "os";
export const build = (command: string) => {
    let out = '';
    if (command[0] === '.' || command[0] === '[') {
        command = '$' + command;
    }
    const fns = command.split('|');
    for (let i = 0; i < fns.length; i++) {
        const fn = fns[i].trim();
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

// type StringHelpers = keyof typeof stringHelpers;

export const run = (command: string, $: any) => {
    'use string';
    const _ = lodash;
    const cast = obj.cast;
    const type = obj.type;
    array();
    string();
    const date = moment;
    const values = Object.values;
    const keys = Object.keys;
    const fs = filesystem();
    Object.keys(stringHelpers).forEach((fn) => {
        (global as any)[fn] = (stringHelpers as any)[fn];
    });
    const EOL = os.EOL;
    return eval(command);
};

