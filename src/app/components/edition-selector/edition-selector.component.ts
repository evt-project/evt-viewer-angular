import { Component} from '@angular/core';
import { map, Observable } from 'rxjs';
import { EVTModelService } from 'src/app/services/evt-model.service';

@Component({
  selector: 'evt-edition-selector',
  templateUrl: './edition-selector.component.html',
  styleUrls: ['./edition-selector.component.scss']
})
export class EditionSelectorComponent {
  public readonly editions$: Observable<Edition[]> = this.evtModelService.editionSources$.pipe(
    map(editions => editions.map(ed => {
      return {
        id: ed.editionInfo.editionId,
        title: ed.editionInfo.editionFriendlyName ?? ed.editionInfo.editionTitle
      };
    }))
  );

  public readonly selectedEditionId$ = this.evtModelService.currentEdition$.pipe(
    map(edition => edition.editionInfo.editionId)
  );

  public readonly selectedEditionTitle$ = this.evtModelService.currentEdition$.pipe(
    map(edition => edition.editionInfo.editionTitle)
  );

  constructor(
    private evtModelService: EVTModelService,
  ) {
  }


  public onEditionChanged(id: string) {
    this.evtModelService.updateEditionId$.next(id);
  }
}

interface Edition {
  id: string;
  title: string;
}