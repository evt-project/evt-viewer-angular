import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
})
@Injectable()
export class FilterPipe implements PipeTransform {
    transform<T>(items: T[], field: string, value: string, caseSensitive: boolean): T[] {
        if (!items) { return []; }
        if (!value || value.length === 0) { return items; }
        try {
            const reg = new RegExp(value, `${caseSensitive ? '' : 'i'}g`);
            const results = items.filter(it => it[field] && value && it[field].match(reg));

            return results.length > 0 ? results : [undefined];
        } catch (e) {
            return [];
        }

    }
}
