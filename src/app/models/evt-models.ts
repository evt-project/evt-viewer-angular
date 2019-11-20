import { Map } from '../utils/jsUtils';

export interface EditionStructure {
    pages: Map<PageData>;
    pagesIndexes: string[];
}

export interface PageData {
    id: string;
    label: string;
    xmlSource: any;
    content: ChildNode[];
}
