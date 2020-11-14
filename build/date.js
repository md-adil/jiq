"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.humanize = void 0;
const moment_1 = __importDefault(require("moment"));
const REFERENCE = moment_1.default(); // fixed just for testing, use moment();
const TODAY = REFERENCE.clone().startOf('day');
const YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
const A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');
exports.humanize = (date) => {
    return date.fromNow();
};
function isToday(date) {
    return date.isSame(TODAY, 'd');
}
function isYesterday(date) {
    return date.isSame(YESTERDAY, 'd');
}
function isWithinAWeek(date) {
    return date.isAfter(A_WEEK_OLD);
}
function isTwoWeeksOrMore(date) {
    return !isWithinAWeek(date);
}
Object.defineProperties(moment_1.default.fn, {
    humanize: {
        get() {
            return exports.humanize(this);
        }
    },
    isToday: {
        get() {
            return isToday(this);
        }
    },
    isYesterday: {
        get() {
            return isYesterday(this);
        }
    },
    isWithinAWeek: {
        get() {
            return isWithinAWeek(this);
        }
    },
    isTwoWeeksOrMore: {
        get() {
            return isTwoWeeksOrMore(this);
        }
    },
});
