export interface Map<T> {
    [key: string]: T;
}

export function flat<T>(a: T[][]): T[] { return a.reduce((x, y) => x.concat(y), []); }

export function uuid(prefix?: string): string { // TODO: use proper UUID generation
    return !!prefix ? `${prefix}-${Math.random()}` : `${Math.random()}`;
}

export function mapToArray<T>(m: Map<T>) {
    return Object.keys(m).map((id) => m[id]);
}

export function arrayToMap<T, K extends keyof T>(arr: T[], key: K): Map<T> {
    const map: Map<T> = {};
    arr.forEach((x) => map[x[`${key}`]] = x);

    return map;
}

export function uniqueObjCharKeys<T>(m: Map<T>) {
    const keys = [];
    Object.keys(m).forEach(key => {
        if (keys.indexOf(key[0].toLowerCase()) < 0) {
            keys.push(key[0].toLowerCase());
        }
    });
    keys.sort();

    return keys;
}
export function uniqueArrayCharKeys(a: string[]) {
    const keys = [];
    a.forEach(key => {
        if (keys.indexOf(key[0].toLowerCase()) < 0) {
            keys.push(key[0].toLowerCase());
        }
    });
    keys.sort((strA, strB) => strA.toLowerCase().localeCompare(strB.toLowerCase()));

    return keys;
}

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param objects - Objects to merge
 * @returns New object with merged key/values
 */
export function mergeDeep<T>(...objects: T[]) { // TODO: never used, remove?
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
}

export function getEventKeyCode(event) {
    let code: number | string;

    if (event.key !== undefined) {
        code = event.key;
    } else if (event.keyIdentifier !== undefined) {
        code = event.keyIdentifier;
    } else if (event.keyCode !== undefined) {
        code = event.keyCode;
    }

    return code;
}

export function normalizeUrl(url) {
    return url && url.indexOf('http') < 0 ? 'http://' + url : url;
}

export function isBoolString(s: string) {
    return s === 'true';
}

export function snakeToCamelCased(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

export function isUrl(path: string) {
    return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(path);
 }
