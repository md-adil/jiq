import _ from "lodash";
const presets = {
    number: parseInt,
    string: String
}

export default function cast(data: any, key: any, castTo?: any) {
    if (typeof key === "function") {
        return key(data);
    }
    if (typeof key === "string" && !castTo) {
        if (key in presets) {
            return (presets as any)[key](data);
        }
        return data[key];
    }
    if (typeof key === "string" && castTo) {
        _.set(data, key, cast(_.get(data, key), castTo));
        return data;
    }

    for (const i in key) {
        _.set(
            data, i, cast(_.get(data, key), key[i])
        )
    }
    return data;
}
