declare global {
    interface Array<T> {
        skipWhile(predicate: (value: T) => boolean): T[];
        takeWhile(predicate: (value: T) => boolean, options?: { includeLastItem: boolean }): T[];
        countBy<K>(selector: (item: T) => K): { key: K; count: number; items: T[] }[];
    }
}

Object.defineProperties(Array.prototype, {
    skipWhile: {
        configurable: true,
        writable: true,
        value: function <T>(this: T[], predicate: (value: T) => boolean): T[] {
            let index = 0;
            while (index < this.length && predicate(this[index])) {
                index++;
            }
            return this.slice(index);
        },
    },
    takeWhile: {
        configurable: true,
        writable: true,
        value: function <T>(this: T[], predicate: (value: T) => boolean, options?: { includeLastItem: boolean }): T[] {
            let index = 0;
            while (index < this.length && predicate(this[index])) {
                index++;
            }
            if (index !== 0 && options?.includeLastItem) index++;
            return this.slice(0, index);
        },
    },
    countBy: {
        configurable: true,
        writable: true,
        value: function <T, K>(this: T[], selector: (item: T) => K) {
            const map = new Map<K, T[]>();
            for (const item of this) {
                const key = selector(item);
                if (!map.has(key)) {
                    map.set(key, [item]);
                } else {
                    map.get(key)!.push(item);
                }
            }

            return Array.from(map.entries()).map(([key, items]) => ({
                key,
                count: items.length,
                items,
                sample: items[0]
            }));
        },
    },
});


export { };
