import { Injectable } from '@angular/core';
import { getEventKeyCode } from '../utils/js-utils';
import { ViewMode } from '../models/evt-models';
import { EVTStatusService } from '../services/evt-status.service';
import { AppConfig } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class ShortcutsService {

  constructor(
    private evtStatusService: EVTStatusService,
  ) {}

  public viewModes: ViewMode[] = AppConfig.evtSettings.ui.availableViewModes?.filter(((e) => e.enable)) ?? [];

  selectViewMode(viewMode: ViewMode) {
    this.evtStatusService.updateViewMode$.next(viewMode);
  }

  handleKeyboardEvent(e: KeyboardEvent) {
    const eKeyCode = getEventKeyCode(e);
    const eKeyCodeStr = String(eKeyCode); 
    if (e.altKey) { // ALT pressed
      if (/^[1-9]$/.test(eKeyCodeStr)) { 
        const selectedViewIndex = this.viewModes[parseInt(eKeyCodeStr) - 1];
        if (selectedViewIndex !== undefined) {
          this.selectViewMode(selectedViewIndex);
          return;
        }
      }
      switch (eKeyCode) {
        // other useful
        case 73: // alt+i
          // Open PROJECT INFO
          break;
        case 76: // alt+l
          // Open Lists
          break;
        case 69: // alt + e
          if (e.shiftKey) { // alt + shift + e
            // Open EVT Info
          }
          break;
        case 66:
          // Open bookmark
          break;
        case 83: { // alt + s
          if (e.shiftKey) { // alt + shift + s
            // Open shortcuts
          }
          break;
        }
      }
    } else {
      if ((e.ctrlKey) && (eKeyCode === 32)) { // GM: CTRL+space
        // TODO: toggle bottom navbar
      } else if ((eKeyCode === 102 || eKeyCode === 70) &&
        (e.ctrlKey || e.metaKey) && e.altKey && e.shiftKey) { // CTRL+ALT+SHIF+f - CMD+ALT+SHIF+f
        // TODO: go fullscreen
      } else if ((eKeyCode === 102 || eKeyCode === 70) &&
        (e.ctrlKey || e.metaKey) && e.altKey) { // CTRL+f - CMD+f
        // TODO: Toggle search
      } else {
        switch (eKeyCode) {
          case 37: // left arrow
            // TODO: Nav left
            break;
          case 39: // right arrow
            // TODO: Nav right
            break;
          case 38: // up
            // TODO: Nav to previous document
            break;
          case 40: // down
            // TODO: Nav to following document
            break;
          case 27:  // escape
            break;
          case 13: // input
            break;
        }
      }
    }
  }
}
