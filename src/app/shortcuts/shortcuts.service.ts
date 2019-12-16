import { Injectable } from '@angular/core';
import { getEventKeyCode } from '../utils/js-utils';

@Injectable({
  providedIn: 'root',
})
export class ShortcutsService {
  handleKeyboardEvent(e: KeyboardEvent) {
    const eKeyCode = getEventKeyCode(e);
    if (e.altKey) { // ALT pressed
      switch (eKeyCode) {
        // TODO: MODE VIEW
        case 49: // alt+1
          // First view mode
          break;
        case 50: // alt+2
          // Second view mode
          break;
        case 51: // alt+3
          // Third view mode
          break;
        case 52: // alt+1
          // Fourth view mode
          break;
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
