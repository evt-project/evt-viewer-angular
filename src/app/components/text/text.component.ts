import { Component, ElementRef, Input, OnInit, Optional } from '@angular/core';
import { Text } from '../../models/evt-models';
import { register } from '../../services/component-register.service';
import { v4 as uuidv4 } from 'uuid';
import { map, Observable, of, shareReplay } from 'rxjs';
import { HoverService } from 'src/app/services/hover.service';
import { WitnessPanelService } from 'src/app/panels/witness-panel/witness-panel.service';
import { isElementBetween } from 'src/app/utils/dom-utils';

@Component({
  selector: 'evt-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
@register(Text)
export class TextComponent implements OnInit {
  @Input() data: Text;

  id: string = uuidv4();

  underlineData$: Observable<UnderlineData> = of({ enabled: false, level: 0 });

  constructor(
    private hoverService: HoverService,
    private elementRef: ElementRef<HTMLElement>,
    @Optional() private witnessPanelService?: WitnessPanelService,
  ) { }

  private exponentMemo = new Map<string, UnderlineData>();

  attachHoverEvents: boolean = true;

  ngOnInit(): void {
    this.attachHoverEvents = !this.witnessPanelService;
    if(!this.attachHoverEvents) return;
    if (this.isChildOfAppDetails(this.elementRef.nativeElement)) return;

    this.underlineData$ = this.hoverService.highlightedAppExponents$
      .pipe(
        map((exponents) => {
          for (const exponent of exponents) {
            const exponentId = exponent.id().valueWithoutRef;
            if (!this.exponentMemo.has(exponentId)) {
              const { fromEl, toEl } = this.hoverService.getDepaElements(exponent);
              const result = isElementBetween(fromEl, this.elementRef.nativeElement, toEl);
              this.exponentMemo.set(exponentId, { enabled: result });
            }

            const memo = this.exponentMemo.get(exponentId);
            if (memo.enabled) return memo;
          }

          return { enabled: false };
        }),
        shareReplay(1) // because in the template there are multiple | async
      );
  }

  onHover(isHovering: boolean) {
    const value = {
      id: this.id,
      element: this.elementRef.nativeElement,
      isHovering: isHovering,
    }
    this.hoverService.hoveredTextOrDefault$.next(value);
  }

  private isChildOfAppDetails(element: HTMLElement): boolean {
    const isChildOfAppDetails = element.closest('evt-apparatus-entry-detail') !== null;
    return isChildOfAppDetails;
  }
}

export interface UnderlineData {
  enabled: boolean;
}
