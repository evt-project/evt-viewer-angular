import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'displayFriendlyName'
})
export class DisplayFriendlyNamePipe implements PipeTransform {
    transform(value: any, nameProp: string, friendlyNameProp?: string): string {
        if (!value || !nameProp) return '';
        return value[friendlyNameProp] || value[nameProp];
    }
}
