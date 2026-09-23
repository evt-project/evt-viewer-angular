import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'evt-synopsis-xml-id-selector',
  templateUrl: './synopsis-xml-id-selector.component.html',
  styleUrls: ['./synopsis-xml-id-selector.component.scss']
})
export class SynopsisXmlIdSelectorComponent implements OnInit {
  @Input() xmlIds: string[];
  @Input() selectedXmlId: string;
  @Output() onXmlIdChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  changeXmlId(xmlId: string): void {
    this.onXmlIdChanged.emit(xmlId)
  }
}
