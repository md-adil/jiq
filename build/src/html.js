"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const array_1 = require("./array");
const chalk_1 = __importDefault(require("chalk"));
const lodash_1 = __importDefault(require("lodash"));
function html(root) {
    Object.defineProperties(root, {
        toJSON: {
            value() {
                return root("head").find('meta').toJSON();
            }
        },
        toTable: {
            value() {
                return root("head").find('meta').toTable();
            }
        }
    });
    Object.defineProperties(root.prototype, {
        pick: {
            value(...args) {
                this.headers = array_1.picker(...args);
                return this;
            }
        },
        at: {
            value(...args) {
                if (!this.length) {
                    return;
                }
                let out = [];
                for (let arg of args) {
                    if (typeof arg === "number") {
                        if (arg < 0) {
                            arg = this.length + arg;
                        }
                        out.push(this.get(arg));
                        continue;
                    }
                    const [from, to] = array_1.parseRange(arg.split(':'), this.length);
                    for (let x = from; x <= to; x++) {
                        out.push(this.get(x));
                    }
                }
                const data = this.constructor.call(this.constructor, this._makeDomArray(out));
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
                return this.map((index, el) => {
                    const data = {};
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
                const rows = [];
                for (let i = 0; i < this.length; i++) {
                    const el = root(this.eq(i));
                    const row = [];
                    for (const i in headers) {
                        const value = headers[i](defineGetter(root(el)));
                        row.push(format(i, value));
                    }
                    rows.push(row);
                }
                return [Object.keys(headers), ...rows];
            }
        }
    });
    return root;
}
exports.default = html;
const format = (key, value) => {
    if (!value) {
        return '';
    }
    switch (key) {
        case ":content":
        case ":text":
            return chalk_1.default.blue(lodash_1.default.truncate(value, { length: 100 }));
        case ":id":
        case ":tagName":
            return chalk_1.default.greenBright(value);
        case ":class":
            return chalk_1.default.dim(value);
        case ":href":
            return chalk_1.default.green(value);
        default:
            return value;
    }
};
const defaultHeaders = (el) => {
    const tagName = el.prop('tagName').toLowerCase();
    switch (tagName) {
        case "meta":
            return array_1.picker(":tagName", ":name", ":content");
        case "a":
            return array_1.picker(':id', ':text', ':href', ':class');
        default:
            return array_1.picker(':id', ':text', ':class');
    }
};
const defineGetter = (el) => new Proxy(el, {
    get(target, key) {
        if (key in target) {
            return target[key];
        }
        const [selector, attr] = key.split(":");
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
const sanitizeText = (txt) => {
    return txt.replace(/(\s+|\t+|\n+|\r+)/g, " ");
};
