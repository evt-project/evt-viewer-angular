import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../app.config';
import { NamedEntityRefData } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EntitiesSelectService } from '../../services/entities-select.service';
import { NamedEntitiesParserService } from '../../services/xml-parsers/named-entities-parser.service';
import { EntitiesSelectItem } from '../entities-select/entities-select.component';

@Component({
  selector: 'evt-named-entity-ref',
  templateUrl: './named-entity-ref.component.html',
  styleUrls: ['./named-entity-ref.component.scss'],
})
@register
export class NamedEntityRefComponent implements OnInit {
  @Input() data: NamedEntityRefData;

  entity$ = this.neParserService.namedEntities$.pipe(
    map(ne => ne.all.entities.find(e => e.id === this.data.entityId) || 'notFound'),
  );

  public highlighted$ = this.entitiesSelectService.selectedItems$.pipe(
    map(items => items.some(i => i && this.matchEntitySelection(i.value))),
  );

  public highlightColor;

  public opened = false;

  constructor(
    private neParserService: NamedEntitiesParserService,
    private entitiesSelectService: EntitiesSelectService,
  ) {
  }

  ngOnInit() {
    this.setHighlightColor();
  }

  toggleEntityData(event: MouseEvent) {
    event.stopPropagation();
    this.opened = !this.opened;
  }

  private setHighlightColor() {
    const entitiesSelectItems = AppConfig.evtSettings.ui.entitiesSelectItems
      .reduce((i: EntitiesSelectItem[], g) => i.concat(g.items), [])
      .reduce((x: EntitiesSelectItem[], y) => {
        const multiValues: EntitiesSelectItem[] = [];
        y.value.split(',').forEach(t => {
          multiValues.push({ ...y, value: t });
        });

        return x.concat(multiValues);
      },      []);

    let bestMatch: EntitiesSelectItem & { score: number };
    entitiesSelectItems.forEach(item => {
      let score = 0;
      score += this.matchEntitySelectionClass(item.value) ? 1 : 0;
      const attributes = this.entitiesSelectService.getAttributesFromValue(item.value);
      score += attributes.length && this.matchEntitySelectionAttributes(item.value) ? 1 : 0;
      if (!bestMatch || bestMatch.score < score) {
        bestMatch = {
          ...item,
          score,
        };
      }
    });
    this.highlightColor = bestMatch ? bestMatch.color : '';
  }

  private matchEntitySelection(selectedValue: string) {
    return selectedValue.split(',').some(v => this.matchEntitySelectionClass(v) && this.matchEntitySelectionAttributes(v));
  }

  private matchEntitySelectionClass(selectedValue: string) {
    return this.data.class.indexOf(this.entitiesSelectService.getClassNameFromValue(selectedValue)) >= 0;
  }

  private matchEntitySelectionAttributes(selectedValue: string) {
    return this.entitiesSelectService.getAttributesFromValue(selectedValue).every(a => this.data.attributes[a.key] === a.value);
  }
}
