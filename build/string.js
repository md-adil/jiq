"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
function string() {
    Object.defineProperties(String.prototype, {
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
        }
    });
}
exports.default = string;
;
