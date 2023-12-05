import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EditionLevelType } from 'src/app/app.config';
import { QuoteEntry } from 'src/app/models/evt-models';

@Component({
  selector: 'evt-source-detail',
  templateUrl: './source-detail.component.html',
  styleUrls: ['../../sources/sources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceDetailComponent {

  private edLevel: EditionLevelType;

  public sourceEntry: QuoteEntry;

  public headVisible: boolean;

  public detailVisible: boolean;

  @Input() set source(el: QuoteEntry) {
    this.sourceEntry = el;
    this.checkVisible(el);
  }
  get source() { return this.sourceEntry; }

  @Input() set editionLevel(el: EditionLevelType) {
    this.edLevel = el;
    this.editionLevelChange.next(el);
  }
  get editionLevel() { return this.edLevel; }
  editionLevelChange = new BehaviorSubject<EditionLevelType | ''>('');

  stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  checkVisible(source: QuoteEntry) {
    this.headVisible = (source.sources.length > 0 || source.extSources.length > 0 || source.text.length > 0);
    this.detailVisible = (source.sources.length > 0  || source.extSources.length > 0 || source.extElements.length > 0);
  }

}

