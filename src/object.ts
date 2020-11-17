import _ from "lodash";
const presets = {
    number: parseInt,
    string: String
}
type Text = string | number;
type CastTo<T> = string | ((x: T) => T);

export function cast<T extends Text>(data: T, key: CastTo<T>): T;
export function cast<T extends Text>(data: T[], key: CastTo<T>): T[];
export function cast<T extends Record<string, Text | Text[]>>(data: T, key: string, castTo: string): T;
export function cast<T extends Record<string, Text | Text[]>>(data: T[], key: string, castTo: string): T[];
export function cast<T extends Record<string, Text | Text[]>>(data: T, key: Record<string, CastTo<T>>): T;
export function cast<T extends Record<string, Text | Text[]>>(data: T[], key: Record<string, CastTo<T>>): T[];

export function cast(data: any, key: any, castTo?: any) {
    if (Array.isArray(data)) {
        const newData = new (data.constructor as any);
        if ("headers" in data) {
            newData.headers = (data as any).headers;
        }
        for (const row of data) {
            newData.push(cast(row, key, castTo));
        }
        return newData;
    }

    if (typeof key === "function") {
        return key(data);
    }

    if (typeof key === "string" && !castTo) {
        if (key in presets) {
            return (presets as any)[key](data);
        }
        return data[key];
    }

    if (typeof key === "string" && castTo) {
        _.set(data, key, cast(_.get(data, key), castTo));
        return data;
    }

    for (const i in key) {
        _.set(
            data, i, cast(_.get(data, i), key[i])
        )
    }
    return data;
}

const typesMapping: {[key: string]: string} = {
    Number: "number",
    String: "string",
    Array: "array",
    Moment: "date",
    Object: "object"
}

export function type(data: any) {
    if (!data) {
        throw new Error("Cannot read type of undefined");
    }
    return  typesMapping[data.constructor.name] || data.constructor.name;
}
