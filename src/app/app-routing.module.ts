import { inject, NgModule } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { EVTStatusService } from './services/evt-status.service';
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

// A URL can point to a view mode disabled in the config after it was bookmarked
const viewModeEnabledGuard: CanActivateFn = (route) => {
  const evtStatusService = inject(EVTStatusService);
  const defaultViewMode = evtStatusService.defaultViewMode;
  if (!defaultViewMode || evtStatusService.availableViewModes.some((vm) => vm.id === route.routeConfig.path)) {
    return true;
  }

  return inject(Router).createUrlTree([`/${defaultViewMode.id}`], { queryParams: route.queryParams });
};

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
].map((route) => ({ ...route, canActivate: [viewModeEnabledGuard] }));
@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
