import { Component } from '@angular/core';

@Component({
  selector: 'evt-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss'],
})
export class ShortcutsComponent {
  // tslint:disable-next-line: no-any
  public shortcuts: Array<{ label: string, instructions: any[] }> = []; // TODO: get rid of instructions

  constructor() {
    this.initShortcuts();
  }

  private initShortcuts() {
    this.shortcuts.push({
      label: 'OpenProjectInfo',
      instructions: [
        { type: 'key', text: 'ALT' },
        { text: '+' },
        { type: 'key', text: 'I' }],
    });
    this.shortcuts.push({
      label: 'OpenLists',
      instructions: [
        { type: 'key', text: 'ALT' },
        { text: '+' },
        { type: 'key', text: 'L' }],
    });
    this.shortcuts.push({
      label: 'OpenCurrentBookmark',
      instructions: [
        { type: 'key', text: 'ALT' },
        { text: '+' },
        { type: 'key', text: 'B' }],
    });
    this.shortcuts.push({
      label: 'OpenEVTInfo',
      instructions: [
        { type: 'key', text: 'ALT' },
        { text: '+' },
        { type: 'key', text: 'SHIFT' },
        { text: '+' },
        { type: 'key', text: 'E' }],
    });
    this.shortcuts.push({
      label: 'OpenShortcuts',
      instructions: [
        { type: 'key', text: 'ALT' },
        { text: '+' },
        { type: 'key', text: 'SHIFT' },
        { text: '+' },
        { type: 'key', text: 'S' }],
    });
    // this.shortcuts.push({
    //   label: 'ChangeView',
    //   instructions: [
    //     { type: 'key', text: 'ALT' },
    //     { text: '+' },
    //     { type: 'key', text: '1' },
    //     { text: '/' },
    //     { type: 'key', text: 'ALT' },
    //     { text: '+' },
    //     { type: 'key', text: '2' },
    //     { text: '/' },
    //     { type: 'key', text: 'ALT' },
    //     { text: '+' },
    //     { type: 'key', text: '3' },
    //     { text: '...' }]
    // });
    // this.shortcuts.push({
    //   label: 'ChangePage',
    //   instructions: [
    //     { type: 'key', text: '&larr;' },
    //     { text: 'and' },
    //     { type: 'key', text: '&rarr;' }]
    // });
    // this.shortcuts.push({
    //   label: 'ChangeDocument',
    //   instructions: [
    //     { type: 'key', text: '&uarr;' },
    //     { text: 'and' },
    //     { type: 'key', text: '&darr;' }]
    // });
    // this.shortcuts.push({
    //   label: 'FullScreen',
    //   instructions: [
    //     { type: 'key', text: 'ctrl' },
    //     { text: '/' },
    //     { type: 'key', text: 'cmd' },
    //     { text: '+' },
    //     { type: 'key', text: 'alt' },
    //     { text: '+' },
    //     { type: 'key', text: 'shift' },
    //     { text: '+' },
    //     { type: 'key', text: 'f' }]
    // });
    // this.shortcuts.push({
    //   label: 'FullScreen',
    //   instructions: [
    //     { type: 'key', text: 'ctrl' },
    //     { text: '/' },
    //     { type: 'key', text: 'cmd' },
    //     { text: '+' },
    //     { type: 'key', text: 'alt' },
    //     { text: '+' },
    //     { type: 'key', text: 'f' }]
    // });
    this.shortcuts.push({
      label: 'CloseModalIfOpened',
      instructions: [
        { type: 'key', text: 'ESC' }],
    });
  }
}
