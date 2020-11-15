import _ from "lodash";
import { cast } from "./object";

type Picker = {
    [key: string]: (data: any) => any;
}

export const picker = (...fields: any[]): Picker => {
    let out: Picker = {};
    if (typeof fields[0] === "string") {
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
        if (typeof callback === "string") {
            out[field] = (data) => _.get(data, callback);
        }
    }
    return out;
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
                if (typeof val === "function") {
                    return this.reduce((prev: any, current: any) => (prev[_.get(current, key)] = val(current), prev), {});
                }
                if (val === ".") {
                    return this.reduce((prev: any, current: any) => (prev[_.get(current, key)] = current, prev), {});
                }
                if (val !== undefined) {
                    return this.reduce((prev: any, current: any) => (prev[_.get(current, key)] = _.get(current, val), prev), {});
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
        at: {
            value(...args: (string|number)[]) {
                if (!this.length) {
                    return;
                }
                let out = new this.constructor;
                if ("headers" in this) {
                    out.headers = this.headers;
                }
                for(const arg of args) {
                    if (typeof arg === "number") {
                        out.push(_.nth(this, arg));
                        continue;
                    }
                    const [ from, to ] = parseRange((arg as string).split(':'), this.length);
                    for (let x = from; x <= to; x++) {
                        out.push(this[x]);
                    }
                }
                return out;
            }
        }
    });
}


export const parseRange = ([x, y]: string[] | string[], length: number) => {
    let from = x ? parseInt(x) : 0;
    let to = y ? parseInt(y) : length - 1;

    if (from < 0) {
        from = length + from;
    }
    if (from < 0) {
        from = 0;
    }

    if (to < 0) {
        to = length + to - 1;
    }
    if (to < from) {
        throw new Error("Invalid range, to must be less than from");
    }

   return [from, to] as const;
}
