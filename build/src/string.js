"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpers = void 0;
const lodash_1 = __importDefault(require("lodash"));
const os_1 = require("os");
const humanize_1 = require("./humanize");
exports.helpers = {
    filesize(txt) {
        return humanize_1.filesize(parseInt(txt));
    },
    uppercase(txt) {
        return txt.toUpperCase();
    },
    lowercase(txt) {
        return txt.toLowerCase();
    },
    camelcase(txt) {
        return lodash_1.default.camelCase(txt);
    },
    upperfirst(txt) {
        return lodash_1.default.upperFirst(txt);
    },
    capitalize(txt) {
        return lodash_1.default.capitalize(txt);
    },
    kebabcase(txt) {
        return lodash_1.default.kebabCase(txt);
    },
    snakecase(txt) {
        return lodash_1.default.snakeCase(txt);
    },
    words(txt) {
        return lodash_1.default.words(txt);
    },
    lines(txt) {
        return txt.split(os_1.EOL);
    }
};
function string() {
    Object.defineProperties(Number.prototype, {
        filesize: {
            get() {
                return humanize_1.filesize(this);
            }
        }
    });
    Object.defineProperties(String.prototype, {
        filesize: {
            get() {
                return humanize_1.filesize(parseInt(this));
            }
        },
        uppercase: {
            get() {
                return this.toUpperCase();
            }
        },
        lowercase: {
            get() {
                return this.toLowerCase();
            }
        },
        camelcase: {
            get() {
                return lodash_1.default.camelCase(this);
            }
        },
        upperfirst: {
            get() {
                return lodash_1.default.upperFirst(this);
            }
        },
        capitalize: {
            get() {
                return lodash_1.default.capitalize(this);
            }
        },
        kebabcase: {
            get() {
                return lodash_1.default.kebabCase(this);
            }
        },
        snakecase: {
            get() {
                return lodash_1.default.snakeCase(this);
            }
        },
        limit: {
            value(length, separator) {
                return lodash_1.default.truncate(this, {
                    length, separator
                });
            }
        },
        words: {
            get() {
                return lodash_1.default.words(this);
            }
        },
        lines: {
            get() {
                return this.split(os_1.EOL);
            }
        }
    });
}
exports.default = string;
;
