import _ from "lodash";
import { cast } from "./object";

type Picker = {
    [key: string]: (data: any) => any;
}

const parseRange = ([x, y]: string[] | string[], length: number) => {
    let from = x ? parseInt(x) : 0;
    let to = y ? parseInt(y) : length - 1;

    if (from < 0) {
        from = length + from;
    }
    if (from < 0) {
        from = 0;
    }

    if (to < 0) {
        to = length + to;
    }
    if (to < from) {
        throw new Error("Invalid range, to must be less than from");
    }

   return [ from, to ] as const;
}

export const at = (items: any[], ...args: any[])  => {
    if (!items.length) {
        return;
    }
    let out = new (items as any).constructor;
    if ("headers" in items) {
        out.headers = (items as any).headers;
    }

    if (args.length === 1 && typeof args[0] === "number") {
        return _.nth(items, args[0]);
    }

    for(const arg of args) {
        if (typeof arg === "number") {
            out.push(_.nth(items, arg));
            continue;
        }
        const [ from, to ] = parseRange((arg as string).split(':'), items.length);
        for (let x = from; x <= to; x++) {
            out.push(items[x]);
        }
    }
    return out;
}

export const picker = (...fields: any[]): Picker => {
    let out: Picker = {};
    if (["string", "number"].includes(typeof fields[0])) {
        for (const field of fields) {
            out[field] = (data) => _.get(data, field);
        }
        return out;
    }

    if (Array.isArray(fields[0])) {
        const keys = fields[0];
        for(let i = 0; i < keys.length; i++) {
            if (!keys[i]) {
                continue;
            }
            out[keys[i]] = (data) => data[i];
        }
        return out;
    }

    out = fields[0];
    for (const field in out) {
        const callback = out[field];
        if (["number", "string"].includes(typeof callback)) {
            out[field] = (data) => _.get(data, callback as any);
        }
    }
    return out;
}

const arrayFilter = Array.prototype.filter;
export const filter = <T = any>(data: T[], prop?: any, val?: any): T[] => {
    if (typeof prop === "function") {
        return arrayFilter.call(data, prop, val);
    }

    if (!prop) {
        return data.filter(x => x);
    }

    if (typeof val === "undefined") {
        val = prop;
        if (val instanceof RegExp) {
            return data.filter( x => val.test(x));
        }
        return data.filter( x => x === val);
    }

    if (val instanceof RegExp) {
        return data.filter( x => val.test(_.get(x, prop)));
    }

    return data.filter( x => _.get(x, prop) === val);
}

export default function array() {
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
                return this.slice(0, length);
            }
        },
        tail: {
            value(length: number) {
                return this.slice(this.length - length);
            }
        },
        pick: {
            value(...args: string[] | Record<string, string>[]) {
                if (typeof args[0] === "string") {
                    return this.map((item: any) => _.pick(item, args as string[]));
                }
                const pick = picker(args[0] as any);
                return this.map((item: any) => {
                    const result: any = {};
                    for(const i in pick) {
                        const key = pick[i];
                        result[i] = key(item);
                    }
                    return result;
                });
            }
        },
        except: {
            value(...args: string[]) {
                return this.map((item: any) => _.omit(item, ...args));
            }
        },
        cast: {
            value(key: any, castTo?: any) {
                return cast(this, key, castTo);
            }
        },
        pluck: {
            value(key: string, val?: any) {
                if (val !== undefined) {
                    return this.reduce((prev: any, current: any) => (prev[_.get(current, key)] = _.get(current, val), prev), {});
                }
                if (typeof val === "function") {
                    return this.reduce((prev: any, current: any) => (prev[_.get(current, key)] = val(current), prev), {});
                }
                return this.map((item: any) => _.get(item, key));
            }
        },
        each: {
            value(callback: (x:any) => any) {
                this.forEach(callback);
                return this;
            }
        },
        filter: {
            value(key: string, val?: any) {
                return filter(this, key, val)
            }
        },
        at: {
            value(...args: (string|number)[]) {
                return at(this, ...args);
            }
        }
    });
}


