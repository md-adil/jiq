import moment, { Moment } from "moment";

const REFERENCE = moment(); // fixed just for testing, use moment();
const TODAY = REFERENCE.clone().startOf('day');
const YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
const A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');

export const humanize = (date: Moment) => {
    return date.fromNow();
}

function isToday(date: Moment) {
    return date.isSame(TODAY, 'd');
}

function isYesterday(date: Moment) {
    return date.isSame(YESTERDAY, 'd');
}

function isWithinAWeek(date: Moment) {
    return date.isAfter(A_WEEK_OLD);
}

function isTwoWeeksOrMore(date: Moment) {
    return !isWithinAWeek(date);
}

Object.defineProperties(moment.fn, {
    humanize: {
        get() {
            return humanize(this);
        }
    },
    toString: {
        value() {
            return humanize(this);
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
})
