import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollationComponent } from './view-modes/collation/collation.component';
import { DocumentalMixedComponent } from './view-modes/documental-mixed/documental-mixed.component';
import { ImageTextComponent } from './view-modes/image-text/image-text.component';
import { ImageOnlyComponent } from './view-modes/image-only/image-only.component';
import { ReadingTextComponent } from './view-modes/reading-text/reading-text.component';
import { TextSourcesComponent } from './view-modes/text-sources/text-sources.component';
import { TextTextComponent } from './view-modes/text-text/text-text.component';
import { TextVersionsComponent } from './view-modes/text-versions/text-versions.component';
import { ImageImageComponent } from './view-modes/image-image/image-image.component';
import { SynopsisComponent } from './view-modes/synopsis/synopsis.component';

const appRoutes: Routes = [
  { path: 'imageText', component: ImageTextComponent },
  { path: 'imageOnly', component: ImageOnlyComponent },
  { path: 'imageImage', component: ImageImageComponent },
  { path: 'readingText', component: ReadingTextComponent },
  { path: 'textText', component: TextTextComponent },
  { path: 'collation', component: CollationComponent },
  { path: 'textSources', component: TextSourcesComponent },
  { path: 'textVersions', component: TextVersionsComponent },
  { path: 'documentalMixed', component: DocumentalMixedComponent },
  { path: 'synopticEdition', component: SynopsisComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
