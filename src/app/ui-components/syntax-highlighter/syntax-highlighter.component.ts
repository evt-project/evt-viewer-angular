import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

declare const Prism: {
  highlight(text: string, grammar: unknown, language?: string): string;
  languages: { [language: string]: unknown };
};

@Component({
  selector: 'evt-syntax-highlighter',
  templateUrl: './syntax-highlighter.component.html',
  styleUrls: ['./syntax-highlighter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyntaxHighlighterComponent implements OnChanges {
  @Input() language = 'markup';
  @Input() content: string;

  highlighted = '';

  ngOnChanges() {
    const text = this.content ?? '';
    const grammar = Prism?.languages?.[this.language];
    this.highlighted = grammar ? Prism.highlight(text, grammar, this.language) : text;
  }
}
