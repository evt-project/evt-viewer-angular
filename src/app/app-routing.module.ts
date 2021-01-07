import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollationComponent } from './view-modes/collation/collation.component';
import { ImageTextComponent } from './view-modes/image-text/image-text.component';
import { ReadingTextComponent } from './view-modes/reading-text/reading-text.component';
import { TextSourcesComponent } from './view-modes/text-sources/text-sources.component';
import { TextTextComponent } from './view-modes/text-text/text-text.component';
import { TextVersionsComponent } from './view-modes/text-versions/text-versions.component';

const appRoutes: Routes = [
  { path: 'imageText', component: ImageTextComponent },
  { path: 'readingText', component: ReadingTextComponent },
  { path: 'textText', component: TextTextComponent },
  { path: 'collation', component: CollationComponent },
  { path: 'textSources', component: TextSourcesComponent },
  { path: 'textVersions', component: TextVersionsComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
