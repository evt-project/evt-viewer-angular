import { Component, Input, OnInit } from '@angular/core';
import { EVT_PREFIX, XMLID_ATTRIBUTE } from 'src/app/models/constants';
import { OriginalEncodingNodeType } from '../../models/evt-models';

@Component({
  selector: 'evt-original-encoding-viewer',
  templateUrl: './original-encoding-viewer.component.html',
  styleUrls: ['./original-encoding-viewer.component.scss'],
})
export class OriginalEncodingViewerComponent implements OnInit {
  @Input() originalEncoding: OriginalEncodingNodeType;

  encodingType: 'xml'; // TODO: expand when other encoding will be handled

  ngOnInit() {
    if (this.originalEncoding && this.originalEncoding.outerHTML) {
      this.encodingType = 'xml';
      this.removeEvtXmlIds(this.originalEncoding);
    }
  }

  removeEvtXmlIds(root: Element): void {
    const isEvtXmlId = (value: string | null): boolean => {
      if (!value) return false;
      return value.startsWith(EVT_PREFIX);
    };

    const traverse = (el: Element) => {
      const xmlId = el.getAttribute(XMLID_ATTRIBUTE);
      if (isEvtXmlId(xmlId)) {
        el.removeAttribute(XMLID_ATTRIBUTE);
      }

      for (const child of Array.from(el.children)) {
        traverse(child);
      }
    };

    traverse(root);
  }
}
