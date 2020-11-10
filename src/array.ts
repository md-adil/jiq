import _ from "lodash";
import cast from "./cast";
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
            value(...args: string[] | Record<string, string>[]) {
                if (typeof args[0] === "string") {
                    return this.map((item: any) => _.pick(item, args as string[]));
                }
                const picker = args[0] as any;
                return this.map((item: any) => {
                    const result: any = {};
                    for(const i in picker) {
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
                return this.map((item: any) => cast(item, key, castTo))
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
        }
    });
}
