import _ from "lodash";
const presetCasts = {
    number: parseInt,
    string: String
}

export default function cast(data: any, key: any, castTo?: any) {
    if (typeof key === "function") {
        return key(data);
    }
    if (typeof key === "string") {
        if (castTo) {
            if(typeof castTo === "string") {
                if (!(castTo in presetCasts)) {
                    throw new Error("Invalid casting " + castTo);
                }
                castTo = (presetCasts as any)[castTo];
            }
            _.set(data, key, castTo(_.get(data, key))); 
            return data;
        }
        if (!(key in presetCasts)) {
            throw new Error("Invalid casting " + key);
        }
        const caster = (presetCasts as any)[key];
        return caster(data);
    }

    for (const i in key) {
        if (typeof key[i] === "string") {
            if (!(key[i] in presetCasts)) {
                throw new Error("invalid casting " + key[i]);
            }
            key[i] = (presetCasts as any)[key[i]];
        }
        _.set(
            data, i, key[i](_.get(data, i))
        )
    }
    return data;
}
