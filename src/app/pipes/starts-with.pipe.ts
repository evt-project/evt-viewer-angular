import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'startsWith',
})
@Injectable()
export class StartsWithPipe implements PipeTransform {
    transform<T>(items: T[], field: string, value: string): T[] {
        if (!items) { return []; }
        if (!value || value.length === 0) { return items; }

        return items.filter(it => it[field] && it[field].toLowerCase()[0] === value);
    }
}
