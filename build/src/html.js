"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const array_1 = require("./array");
const chalk_1 = __importDefault(require("chalk"));
const cheerio_1 = __importDefault(require("cheerio"));
const lodash_1 = __importDefault(require("lodash"));
function html(html) {
    const root = cheerio_1.default.load(html);
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
                const data = this.constructor.call(this.constructor, this._makeDomArray(array_1.at(this.toArray(), ...args)));
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
        case ":src":
            return chalk_1.default.green(value);
        default:
            return value;
    }
};
const defaultHeaders = (el) => {
    const tagName = el.prop('tagName').toLowerCase();
    switch (tagName) {
        case "img":
            return array_1.picker(":id", ":src", ":class");
        case "meta":
            return array_1.picker(":tagName", ':charset', ":name", ":content", ':http-equiv');
        case "a":
            return array_1.picker(':text', ':href', ':download', ':target');
        case "link":
            return array_1.picker(':href', ':rel', ':media', ':sizes', ':title', ':type', ':crossorigin');
        case "script":
            return array_1.picker(":src", ':async', ':charset', ':defer', ':type');
        default:
            return array_1.picker(':id', ':text', ':class');
    }
};
const defineGetter = (el) => new Proxy(el, {
    get(target, key) {
        var _a;
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
            return (_a = el.attr("class")) === null || _a === void 0 ? void 0 : _a.split(" ").join(".");
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
