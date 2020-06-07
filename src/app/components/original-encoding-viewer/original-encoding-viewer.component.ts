import { Component, Input, OnInit } from '@angular/core';
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
    }
  }

}
