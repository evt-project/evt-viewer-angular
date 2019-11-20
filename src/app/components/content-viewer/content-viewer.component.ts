import { Component, OnInit, OnDestroy, Input, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';

import { GenericParserService } from '../../services/xml-parsers/generic-parser.service';
import { AttributesMap } from 'ng-dynamic-component';

@Component({
  selector: 'evt-content-viewer',
  templateUrl: './content-viewer.component.html'
})
export class ContentViewerComponent implements OnInit, OnDestroy {
  @Input() content: HTMLElement;
  @ViewChild('container', { read: ViewContainerRef, static: false }) container: ViewContainerRef;
  public parsedContent: any;
  public inputs: { [keyName: string]: any };
  // tslint:disable-next-line: ban-types
  public outputs: { [keyName: string]: Function };
  public attributes: AttributesMap;

  private componentRef: ComponentRef<{}>;

  constructor(private parser: GenericParserService) {
  }

  ngOnInit() {
    this.parser.parse(this.content).then(
      (parsedContent: any) => {
        if (parsedContent) {
          if (parsedContent.type !== 'comment') {
            this.parsedContent = parsedContent;
            this.inputs = { data: parsedContent };
            this.outputs = {};
            this.attributes = parsedContent.attributes || {};
            if (parsedContent.class) {
              this.attributes.class = this.attributes.class || '';
              this.attributes.class += ' ' + parsedContent.class;
            }
          }
        } else {
          console.log(this.content, parsedContent);
        }
      },
      (err) => console.error(this.content, err));
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
