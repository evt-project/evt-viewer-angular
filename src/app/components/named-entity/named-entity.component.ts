import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { map, shareReplay } from 'rxjs/operators';
import { NamedEntity, NamedEntityOccurrence, NamedEntityOccurrenceRef } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { EVTModelService } from '../../services/evt-model.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { EditionInfo, NamedEntitiesService } from '../../services/named-entities.service';

@register(NamedEntity)
@Component({
  selector: 'evt-named-entity',
  templateUrl: './named-entity.component.html',
  styleUrls: ['./named-entity.component.scss'],
})
export class NamedEntityComponent implements OnInit {
  @Input() data: NamedEntity;
  @Input() inList: boolean;

  readonly activeOccurrencesView$ = new BehaviorSubject<OccurrencesGroupingView>('form');

  readonly occurrences$: Observable<EditionOccurrences[]> = this.namedEntitiesService.allEntitiesOccurrences$.pipe(
    map(x => {
      const result = x.filter(y => y.entitiesOccurrences[this.data.id]);
      return result.map(({ editionInfo, entitiesOccurrences }) => {
        const occurrences = entitiesOccurrences[this.data.id] || [];
        const pageOccurrenceCount = occurrences
          .flatMap(x => x.refsByDoc)
          .reduce((x, y) => x + y.refs?.length, 0);
        return { editionInfo, occurrences, pageOccurrenceCount };
      })
    }),
    shareReplay(1)
  );
  
  readonly occurrencesFoundLabel$: Observable<OccurrencesLabel> = this.occurrences$.pipe(
    map(editionOccurrences => {
      const occurrences = editionOccurrences.flatMap(x => x.occurrences);
      const occurrencesCount = this.getPageOccurrenceCount(occurrences);
      return { occurrencesCount, formsCount: occurrences.length };
    }),
  )
  
  readonly occurrencesForms$: Observable<OccurrencesForm[]> = this.namedEntitiesService.allEntitiesOccurrences$.pipe(
    map(editionNamedEntitiesOccurrences => {
      const occurrencesFormsMap: Map<string, EditionOccurrences[]> = new Map();
      for (const { editionInfo, entitiesOccurrences } of editionNamedEntitiesOccurrences) {
        const namedEntityOccurrences = entitiesOccurrences[this.data.id] || [];
        if (!namedEntityOccurrences.length) continue;

        for (const namedEntityOccurrence of namedEntityOccurrences) {
          const formObj = namedEntityOccurrence.refsByDoc[0].refs[0].content[0] as any;
          const form = formObj.text;
          if (!occurrencesFormsMap.has(form)) {
            occurrencesFormsMap.set(form, []);
          }
        }

        for (const currentForm of occurrencesFormsMap.keys()) {
          const occurrences = namedEntityOccurrences.filter(x => {
            const formObj = x.refsByDoc[0].refs[0].content[0] as any;
            return formObj.text === currentForm;
          })
          const pageOccurrenceCount = this.getPageOccurrenceCount(occurrences);
          const editionOccurrences = { editionInfo, occurrences, pageOccurrenceCount };
          occurrencesFormsMap.get(currentForm).push(editionOccurrences);
        }
      }

      const result: OccurrencesForm[] = Array.from(occurrencesFormsMap)
        // since the ui shows cycles all editions in a form, we skip the editions with no occurrences of that form
        .map(([form, editionOccurrences]) => ({ form, editionOccurrences: editionOccurrences.filter(x => x.occurrences.length > 0) }));
      return result;
    }),
    shareReplay(1)
  );

  relations$ = this.evtModelService.relations$.pipe(
    map((el) => el.filter((rel) => rel.activeParts.indexOf(this.data.id) >= 0 ||
      rel.passiveParts.indexOf(this.data.id) >= 0 || rel.mutualParts.indexOf(this.data.id) >= 0)));

  @ViewChild('entityDetails') entityDetails: NgbNav;

  public contentOpened = true;

  get selectedSection() {
    if (this.contentOpened) {
      return `${this.data && this.data.content.length === 0 ? 'occurrences' : 'info'}_${this.data.id}`;
    }

    return '';
  }

  constructor(
    private evtModelService: EVTModelService,
    private namedEntitiesService: NamedEntitiesService,
  ) {
  }

  ngOnInit() {
    if (this.inList) {
      this.contentOpened = false;
    }
  }

  toggleContent() {
    if (this.inList) {
      this.contentOpened = !this.contentOpened;
    }
  }

  tabSelected(event: MouseEvent) {
    event.stopPropagation();
  }

  private getPageOccurrenceCount(occurrences: NamedEntityOccurrence[]) {
    const result = occurrences
      .flatMap(x => x.refsByDoc)
      .reduce((x, y) => x + y.refs?.length, 0);
    return result;
  }

  goToOccurrenceRef($event: NamedEntityOccurrenceRef) {
    console.log('goToOccurrenceRef', $event)
    // Todo
  }
}

export interface OccurrencesLabel {
  occurrencesCount: number,
  formsCount: number,
}

export interface EditionOccurrences {
  editionInfo: EditionInfo;
  occurrences: NamedEntityOccurrence[];
  pageOccurrenceCount: number;
}

export interface OccurrencesForm {
  form: string;
  editionOccurrences: EditionOccurrences[];
}

export type OccurrencesGroupingView = 'edition' | 'form';