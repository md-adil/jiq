import _ from "lodash";
export default function string() {
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
        }
    });
};
