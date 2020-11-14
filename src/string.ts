import _ from "lodash";
import { EOL } from "os";
import { filesize } from "./humanize";
export default function string() {
    Object.defineProperties(Number.prototype, {
        filesize: {
            get() {
                return filesize(this);
            }
        }
    });
    Object.defineProperties(String.prototype, {
        filesize: {
            get() {
                return filesize(parseInt(this));
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
                return _.camelCase(this)
            }
        },
        upperfirst: {
            get() {
                return _.upperFirst(this);
            }
        },
        capitalize: {
            get() {
                return _.capitalize(this);
            }
        },
        kebabcase: {
            get() {
                return _.kebabCase(this);
            }
        },
        snakecase: {
            get() {
                return _.snakeCase(this);
            }
        },
        limit: {
            value(length?: number, separator?: string) {
                return _.truncate(this, {
                    length, separator
                })
            }
        },
        words: {
            get() {
                return _.words(this);
            }
        },
        lines: {
            get() {
                return this.split(EOL);
            }
        }
    });
};
