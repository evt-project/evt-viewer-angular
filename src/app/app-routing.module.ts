import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageTextComponent } from './view-modes/image-text/image-text.component';
import { ReadingTextComponent } from './view-modes/reading-text/reading-text.component';
import { CollationComponent } from './view-modes/collation/collation.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/readingText', pathMatch: 'full' },
  { path: 'imageText', component: ImageTextComponent },
  { path: 'readingText', component: ReadingTextComponent },
  { path: 'collation', component: CollationComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
