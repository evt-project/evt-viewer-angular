/* eslint-disable */
import { EVTConfig } from '../app.config';

export const TEST_EVT_CONFIG = {
  "edition": {
    "editionTitle": "EVT 3",
    "badge": "beta",
    "editionHome": "evt.labcd.unipi.it/",
    "logoUrl": "data/images/logo/logo.png",
    "defaultEditionLevel": "critical",
    "availableEditionLevels": [
      {
        "id": "diplomatic",
        "label": "diplomatic",
        "enable": true,
        "hidden": false
      },
      {
        "id": "interpretative",
        "label": "interpretative",
        "enable": true,
        "hidden": false
      },
      {
        "id": "critical",
        "label": "critical",
        "enable": true,
        "hidden": false
      },
      {
        "id": "changesView",
        "label": "changes",
        "enable": true,
        "hidden": true
      }
    ],
    "mainMenuConfig": {
      "downloadableXMLSource": true,
      "showEntitiesLists": true,
      "downloadLinks": [
        {
          "label": "example",
          "url": "http://example.com"
        }
      ]
    },
    "namedEntitiesLists": {
      "persons": {
        "label": "Persons",
        "enable": true,
        "listSelector": "listPerson",
        "namedEntityType": "person"
      },
      "places": {
        "enable": true,
        "label": "Places",
        "listSelector": "listPlace",
        "namedEntityType": "place"
      },
      "organizations": {
        "enable": true,
        "label": "Organizations",
        "listSelector": "listOrg",
        "namedEntityType": "org"
      },
      "relations": {
        "enable": true,
        "label": "Relations",
        "listSelector": "listRelation",
        "namedEntityType": "relation"
      },
      "events": {
        "enable": true,
        "label": "Events",
        "listSelector": "listEvent",
        "namedEntityType": "event"
      },
      "entries": {
        "enable": true,
        "label": "Entries",
        "listSelector": "div[type='glossary']",
        "namedEntityType": "entry"
      },
      "objects": {
        "enable": true,
        "label": "Objects",
        "listSelector": "listObject",
        "namedEntityType": "object"
      }
    },
    "entitiesOccurrenceSelectors": [
      "persName[ref]",
      "placeName[ref]",
      "orgName[ref]",
      "geogName[ref]",
      "event[ref]",
      "term[ref]"
    ],
    "entitiesSelectItems": [
      {
        "label": "Named Entities",
        "enable": true,
        "items": [
          {
            "value": "persName",
            "label": "persons",
            "color": "#ffcdd2",
            "enable": true
          },
          {
            "value": "persName[type='episcopus']",
            "label": "bishops",
            "color": "rgb(139, 98, 236)",
            "enable": true
          },
          {
            "value": "placeName,geogName",
            "label": "places",
            "color": "#A5D6A7",
            "enable": true
          },
          {
            "value": "orgName",
            "label": "organizations",
            "color": "#FFB74D",
            "enable": true
          }
        ]
      },
      {
        "label": "Other",
        "enable": true,
        "items": [
          {
            "value": "event",
            "label": "events",
            "color": "#fcfc60",
            "enable": true
          },
          {
            "value": "rolename",
            "label": "roles",
            "enable": true
          },
          {
            "value": "measure",
            "label": "measures",
            "enable": true
          }
        ]
      }
    ],
    "notSignificantVariants": [
      "type=orthographic"
    ],
    "proseVersesToggler": true,
    "defaultTextFlow": "prose",
    "verseNumberPrinter": 5,
    "readingColorLight": "rgb(255 241 208)",
    "readingColorDark": "rgb(101, 138, 255)",
    "analogueMarkers": [
      "ParallelPassage",
      "parallelPassage",
      "Parallel",
      "parallel"
    ],
    "sourcesExcludedFromListByParent": [
      "desc"
    ],
    "showSubstitutionMarker": true,
    "showSeparatorBetweenChanges": true,
    "startingFromDefinitiveLayer": true,
    "showChangeLayerMarkerInText": true,
    "changeSequenceView": {
      "showVarSeqAttr": false,
      "showSeqAttr": false,
      "layerColors": {
        "strato-0": "#d4a03b",
        "strato-1": "#d99102",
        "strato-2": "#ac7301",
        "strato-3": "#855801",
        "strato-4": "#5f3f01",
        "strato-5": "#352400"
      }
    },
    "multiPageEngineForCriticalEdition": false,
    "structureSeparators": [
      "pb"
    ],
    "exponentEnumerateBy": "seg",
    "transformWitnessId": true,
    "externalBibliography": {
      "biblAttributeToMatch": "xml:id",
      "elementAttributesToMatch": [
        "target",
        "source"
      ]
    },
    "biblTab": {
      "propsToShow": [
        "author",
        "title",
        "date",
        "editor",
        "publisher",
        "pubPlace",
        "citedRange",
        "biblScope"
      ],
      "showAttrNames": false,
      "showEmptyValues": false,
      "inline": true,
      "commaSeparated": true,
      "showMainElemTextContent": true
    }
  },
  "ui": {
    "defaultViewMode": "collation",
    "availableViewModes": [
      {
        "icon": "images",
        "iconSet": "fas",
        "id": "imageImage",
        "label": "Image-Image",
        "enable": false
      },
      {
        "icon": "image",
        "iconSet": "fas",
        "id": "imageOnly",
        "label": "Image only",
        "enable": false
      },
      {
        "icon": "txt",
        "iconSet": "evt",
        "id": "readingText",
        "label": "Reading Text",
        "enable": true
      },
      {
        "icon": "imgTxt",
        "iconSet": "evt",
        "id": "imageText",
        "label": "Image Text",
        "enable": true
      },
      {
        "icon": "txtTxt",
        "iconSet": "evt",
        "id": "textText",
        "label": "Text Text",
        "enable": true
      },
      {
        "icon": "collation",
        "iconSet": "evt",
        "id": "collation",
        "label": "Collation",
        "enable": true
      },
      {
        "icon": "srcTxt",
        "iconSet": "evt",
        "id": "textSources",
        "label": "Text Sources",
        "enable": false
      },
      {
        "icon": "versions",
        "iconSet": "evt",
        "id": "textVersions",
        "label": "Text Versions",
        "enable": false
      },
      {
        "icon": "documix",
        "iconSet": "evt",
        "id": "documentalMixed",
        "label": "Documental",
        "enable": true
      },
      {
        "icon": "versions",
        "iconSet": "evt",
        "id": "synopticEdition",
        "label": "Synoptic edition",
        "enable": true
      }
    ],
    "localization": true,
    "defaultLocalization": "en",
    "availableLanguages": [
      {
        "code": "en",
        "label": "languageEn",
        "enable": true,
        "iconUrl": "assets/images/en.png"
      },
      {
        "code": "fr",
        "label": "languageFr",
        "enable": true,
        "iconUrl": "assets/images/fr.png"
      },
      {
        "code": "it",
        "label": "languageIt",
        "enable": true,
        "iconUrl": "assets/images/it.png"
      }
    ],
    "enableNavBar": true,
    "initNavBarOpened": true,
    "thumbnailsButton": true,
    "viscollButton": false,
    "mainFontFamily": "Junicode, Times, serif",
    "mainFontSize": "1.1rem",
    "secondaryFontFamily": "Arial, sans-serif",
    "secondaryFontSize": "1.1em",
    "theme": "modern",
    "syncZonesHighlightButton": true,
    "defaultImageZoomLevel": 0.8,
    "maxImageZoomLevel": 2,
    "defaultBibliographicStyle": "chicago",
    "allowedBibliographicStyles": {
      "chicago": {
        "id": "chicago",
        "label": "Chicago (Author-Date)",
        "enabled": true,
        "propsOrder": [
          "author",
          "date",
          "title",
          "editor",
          "publication",
          "pubPlace",
          "publisher",
          "doi"
        ],
        "properties": {
          "titleQuotes": true,
          "emphasized": [
            "publisher"
          ]
        }
      },
      "apa": {
        "id": "apa",
        "label": "APA",
        "enabled": true,
        "propsOrder": [
          "author",
          "date",
          "title",
          "publication",
          "publisher",
          "doi"
        ],
        "properties": {
          "authorStyle": {
            "delimiter": ",",
            "forenameInitials": true,
            "maxAuthors": 3
          },
          "publicationStyle": {
            "citingAcronym": "none",
            "inBrackets": [
              "issue"
            ]
          },
          "propsDelimiter": ".",
          "titleQuotes": false,
          "emphasized": [
            "publication"
          ],
          "inBrackets": [
            "date"
          ]
        }
      },
      "mla": {
        "id": "mla",
        "label": "MLA",
        "enabled": true,
        "propsOrder": [
          "author",
          "title",
          "publication",
          "publisher",
          "doi"
        ],
        "properties": {
          "propsDelimiter": ".",
          "authorStyle": {
            "delimiter": ","
          },
          "publicationStyle": {
            "citingAcronym": "all",
            "inBrackets": [
              "issue"
            ],
            "includeEditor": true
          },
          "dateInsidePublication": true,
          "titleQuotes": false,
          "emphasized": [
            "publication"
          ]
        }
      }
    }
  },
  "editionTextSources": []
} as unknown as EVTConfig;
