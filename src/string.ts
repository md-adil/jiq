import _ from "lodash";
import {EOL} from "os";
import {filesize} from "./humanize";

export const helpers = {
    filesize(txt: string) {
        return filesize(parseInt(txt));
    },
    uppercase(txt: string) {
        return txt.toUpperCase();
    },
    lowercase(txt: string) {
        return txt.toLowerCase();
    },
    camelcase(txt: string) {
        return _.camelCase(txt)
    },
    upperfirst(txt: string) {
        return _.upperFirst(txt);
    },
    capitalize(txt: string) {
        return _.capitalize(txt);
    },
    kebabcase(txt: string) {
        return _.kebabCase(txt);
    },
    snakecase(txt: string) {
        return _.snakeCase(txt);
    },
    words(txt: string) {
        return _.words(txt);
    },
    lines(txt: string) {
        return txt.split(EOL);
    }
}

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

