// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import './app/extensions/array.extensions';
import './app/extensions/string.extensions';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { DisplayFriendlyNamePipe } from './app/pipes/displayFriendlyName.pipe';
import { FilterPipe } from './app/pipes/filter.pipe';
import { HumanizePipe } from './app/pipes/humanize.pipe';
import { StartsWithPipe } from './app/pipes/starts-with.pipe';
import { VisibleAttributesPipe } from './app/pipes/visibleAttributes.pipe';
import { XmlBeautifyPipe } from './app/pipes/xml-beautify.pipe';
import { AppConfig } from './app/app.config';
import { ApparatusEntryDetailService } from './app/components/apparatus-entry/apparatus-entry-detail/apparatus-entry-detail.service';
import { WitnessPanelService } from './app/panels/witness-panel/witness-panel.service';
import { AnnotatorService } from './app/services/annotator/annotator.service';
import { IdbService } from './app/services/idb.service';
import { ThemesService } from './app/services/themes.service';
import { GenericParserService } from './app/services/xml-parsers/generic-parser.service';
import { XMLParsers } from './app/services/xml-parsers/xml-parsers';
import { TEST_ELEMENT } from './app/test-utils/test-data';
import { TEST_EVT_CONFIG } from './app/test-utils/test-evt-config';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false },
},
);
beforeEach(() => {
  AppConfig.evtSettings = TEST_EVT_CONFIG;
  TestBed.configureTestingModule({
    declarations: [
        DisplayFriendlyNamePipe,
        FilterPipe,
        HumanizePipe,
        StartsWithPipe,
        VisibleAttributesPipe,
        XmlBeautifyPipe,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [TranslateModule.forRoot(),
        NgbModule,
        RouterTestingModule],
    providers: [
        AnnotatorService,
        AppConfig,
        ApparatusEntryDetailService,
        WitnessPanelService,
        GenericParserService,
        IdbService,
        ThemesService,
        XMLParsers,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
});

const KEEP_DATA_UNSET = new Set(['BiblioListComponent', 'MsFragComponent', 'MsPartComponent']);

const createComponent = TestBed.createComponent;
TestBed.createComponent = function <T>(component: Type<T>): ComponentFixture<T> {
  const fixture = createComponent.call(this, component) as ComponentFixture<T>;
  const instance = fixture.componentInstance as { data?: unknown };
  if (instance && instance.data === undefined && !KEEP_DATA_UNSET.has(component.name)) {
    instance.data = TEST_ELEMENT;
  }

  return fixture;
};
