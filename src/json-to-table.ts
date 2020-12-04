import chalk from "chalk";
export default function jsonToTable(data: any) {
    if (!data) {
        return;
    }
    if (isPrintable(data)) {
        return [[ "(Value)" ], [ format(data) ]];
    }
    const plainObject = flatObject(data);
    const rows = [[ "(key)", "(value)" ]];
    for (const key in plainObject) {
        rows.push([
            chalk.green(key), format(plainObject[key])
        ]);
    }
    return rows;
}

export const format = (val: any) => {
    if (!isNaN(val)) {
        return chalk.yellow(val);
    }
    return val;
}

export const flatObject = (data: any): any => {
    if (!data) {
        return data;
    }
    if (data.toJSON) {
        return data.toJSON();
    }
    
    if (isPrintable(data)) {
        return data;
    }

    if (Array.isArray(data) && isPrintableArray(data)) {
        return data.join(", ");
    }

    const out: any = {};
    for (const key in data) {
        const flatten = flatObject(data[key]);
        if (isPrintable(flatten)) {
            out[key] = flatten;
            continue;
        }
        for (const subkey in flatten) {
            out[`${key}.${subkey}`] = flatten[subkey];
        }
    }
    return out;
}

const isPrintableArray = (items: any[]) => !items.some(i => !isPrintable(i));

const isPrintable = (data: any) => {
    const type = typeof data;
    return type === "string" || type === "number";
}
