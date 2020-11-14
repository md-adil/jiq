import _ from "lodash";
import { cast } from "./object";

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
                const picker = args[0] as any;
                return this.map((item: any) => {
                    const result: any = {};
                    for(const i in picker) {
                        const key = picker[i];
                        if (typeof key === "function") {
                            result[i] = key(item);
                            continue;
                        }
                        result[i] = _.get(item, picker[i]);
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
                let out = new this.constructor;
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
        to = length + to - 1;
    }
    if (to < from) {
        throw new Error("Invalid range, to must be less than from");
    }

   return [from, to] as const;
}
