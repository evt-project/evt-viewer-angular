import { Pipe, PipeTransform } from '@angular/core';
import * as vkbeautify from 'vkbeautify';
import { replaceMultispaces } from '../utils/xml-utils';

@Pipe({
    name: 'xmlBeautify',
})
export class XmlBeautifyPipe implements PipeTransform {

    transform(value: string) {
        return vkbeautify.xml(replaceMultispaces('\n' + value));
    }

}
