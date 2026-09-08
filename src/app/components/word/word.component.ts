import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { GenericElement, Lb, Text, Word } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EvtLinesHighlightService } from '../../services/evt-lines-highlight.service';
import { EditionlevelSusceptible, Highlightable } from '../components-mixins';

export interface WordComponent extends EditionlevelSusceptible, Highlightable { }

@Component({
  selector: 'evt-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@register(Word)
export class WordComponent {
  @Input() data: Word;

  readonly Lb = Lb;

  constructor(private evtHighlineService: EvtLinesHighlightService) { }

  get isPlainText(): boolean {
    return this.word.every((el) => el.type === Text);
  }

  get plainTextWord(): Text[] {
    return this.word as Text[];
  }

  onWordMouseOver($event: MouseEvent) {
    const textNode = this.plainTextWord[0];
    const { lbId, correspId } = textNode as any;
    if (!lbId || !correspId) return;
    if (textNode.text === '' || textNode.text === ' ') return;

    $event.preventDefault();
    this.evtHighlineService.setHovered({ id: lbId, corresp: correspId });
  }

  onWordMouseLeave($event: MouseEvent) {
    $event.preventDefault();
    this.evtHighlineService.setHovered(null);
  }

  onWordClick($event: MouseEvent) {
    $event.stopPropagation();

    const textNode = this.plainTextWord[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { lbId, correspId } = textNode as any;
    if (!lbId || !correspId) return;
    if (textNode.text === '' || textNode.text === ' ') return;

    $event.preventDefault();
    this.evtHighlineService.setSelected({ id: lbId, corresp: correspId });
  }

  get word(): GenericElement[] {
    const content = this.data.content as GenericElement[];

    if (this.editionLevel === 'diplomatic') {
      return content;
    }

    const lbIndex = content.findIndex((el) => el.type === Lb);
    if (lbIndex >= 0) {
      const wordContent = [...content];
      wordContent.splice(lbIndex, 1);
      wordContent.push(content[lbIndex]);

      return wordContent;
    }

    return content;
  }
}
