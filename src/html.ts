import { picker, at } from "./array";
import chalk from "chalk";

import _ from "lodash";


export default function html(root: cheerio.Root) {
    Object.defineProperties(root, {
        toJSON: {
            value() {
                return (root("head").find('meta') as any).toJSON();
            }
        },
        toTable: {
            value() {
                return (root("head").find('meta') as any).toTable();
            }
        }
    });

    Object.defineProperties(root.prototype, {
        pick: {
            value(...args: any[]) {
                this.headers = picker(...args);
                return this;
            }
        },
        at: {
            value(...args: string[]) {
                if (!this.length) {
                    return;
                }
                const data = this.constructor.call(this.constructor, this._makeDomArray(at(this.toArray(), ...args)));
                data.headers = this.headers;
                return data;
            }
        },

        toJSON: {
            value() {
                if (!this.length) {
                    return null;
                }
                const headers = this.headers || defaultHeaders(this);
                return this.map((index: number, el: any) => {
                    const data: any = {};
                    for (const i in headers) {
                        data[i] = headers[i](defineGetter(root(el)));
                    }
                    return data;
                }).toArray();
            }
        },
        toTable: {
            value() {
                if (!this.length) {
                    return [];
                }
                const headers = this.headers || defaultHeaders(this);
                const rows: string[][] = [];
                for (let i = 0; i < this.length; i++) {
                    const el = root(this.eq(i));
                    const row: string[] = [];
                    for (const i in headers) {
                        const value = headers[i](defineGetter(root(el)));
                        row.push(format(i, value));
                    }
                    rows.push(row);
                }
                return [ Object.keys(headers), ...rows ];
            }
        }
    });
    return root;
}

const format = (key: string, value: string) => {
    if (!value) {
        return '';
    }
    switch(key) {
        case ":content":
        case ":text":
            return chalk.blue(_.truncate(value, {length: 100}));
        case ":id":
        case ":tagName":
            return chalk.greenBright(value);
        case ":class":
            return chalk.dim(value);
        case ":href":
        case ":src":
            return chalk.green(value);

        default:
            return value;
    }
}

const defaultHeaders = (el: cheerio.Cheerio) => {
    const tagName = el.prop('tagName').toLowerCase();
    switch(tagName) {
        case "script":
        case "img":
            return picker(":id", ":src", ":class");
        case "meta":
            return picker(":tagName", ":name", ":content");
        case "a":
        case "link":
            return picker(':id', ':text', ':href', ':class');
        default:
            return picker(':id', ':text', ':class');
    }
}

const defineGetter = (el: cheerio.Cheerio) => new Proxy(el, {
    get(target, key) {
        if (key in target) {
            return (target as any)[key];
        }
        const [ selector, attr ] = (key as string).split(":");
        const el = selector ? target.find(selector) : target;
        if (!attr || attr === "text") {
            return sanitizeText(el.text());
        }
        if (attr === "tagName") {
            return el.prop("tagName");
        }
        if (attr === "class") {
            return el.attr("class")?.split(" ").join(".");
        }
        if (attr === "html") {
            return el.html();
        }
        return el.attr(attr);
    }
});

const sanitizeText = (txt: string) => {
    return txt.replace(/(\s+|\t+|\n+|\r+)/g, " ");
}