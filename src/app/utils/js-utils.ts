export interface Map<T> {
    [key: string]: T;
}

export const flat = <T>(a: T[][]) => a.reduce((x, y) => x.concat(y), []);

// TODO: use proper UUID generation
export const uuid = (prefix?: string): string => !!prefix ? `${prefix}-${Math.random()}` : `${Math.random()}`;

export const mapToArray = <T>(m: Map<T>) => Object.keys(m).map((id) => m[id]);

export const arrayToMap = <T, K extends keyof T>(arr: T[], key: K): Map<T> => {
    const map: Map<T> = {};
    arr.forEach((x) => map[x[`${key}`]] = x);

    return map;
};

export const uniqueObjCharKeys = <T>(m: Map<T>) => {
    const keys = [];
    Object.keys(m).forEach(key => {
        if (keys.indexOf(key[0].toLowerCase()) < 0) {
            keys.push(key[0].toLowerCase());
        }
    });
    keys.sort();

    return keys;
};

export const uniqueArrayCharKeys = (a: string[]) => {
    const keys = [];
    a.forEach(key => {
        if (keys.indexOf(key[0].toLowerCase()) < 0) {
            keys.push(key[0].toLowerCase());
        }
    });
    keys.sort((strA, strB) => strA.toLowerCase().localeCompare(strB.toLowerCase()));

    return keys;
};

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param objects - Objects to merge
 * @returns New object with merged key/values
 */
export const mergeDeep = <T>(...objects: T[]) => { // TODO: never used, remove?
    const isObject = (obj: T) => obj && typeof obj === 'object';
    const cb = (prev: T, obj: T) => {
        Object.keys(obj).forEach(key => {
            const pVal = prev[key];
            const oVal = obj[key];

            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = [...pVal, ...oVal].filter((element, index, array) => array.indexOf(element) === index);
            } else if (isObject(pVal) && isObject(oVal)) {
                prev[key] = mergeDeep(pVal, oVal);
            } else {
                prev[key] = oVal;
            }
        });

        return prev;
    };

    return objects.reduce(cb, {});
};

export const getEventKeyCode = (event) => {
    let code: number | string;

    if (event.key !== undefined) {
        code = event.key;
    } else if (event.keyIdentifier !== undefined) {
        code = event.keyIdentifier;
    } else if (event.keyCode !== undefined) {
        code = event.keyCode;
    }

    return code;
};

export const normalizeUrl = (url: string) => url && url.indexOf('http') < 0 ? 'http://' + url : url;

export const isBoolString = (s: string) => s === 'true';
