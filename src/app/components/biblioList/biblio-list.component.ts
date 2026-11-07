import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BibliographicEntry, BibliographicList, BibliographicStructEntry, MsDesc } from '../../models/evt-models';
@Component({
  selector: 'evt-biblio-list',
  templateUrl: './biblio-list.component.html',
  styleUrls: ['./biblio-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiblioListComponent {
  @Input() data: BibliographicList;

  readonly MsDesc = MsDesc;
  readonly BibliographicStructEntry = BibliographicStructEntry;
  readonly BibliographicList = BibliographicList;
  readonly BibliographicEntry = BibliographicEntry;
  readonly PlainObject = Object;
}
