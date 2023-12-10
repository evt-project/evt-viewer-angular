import { Injectable } from '@angular/core';
import { AttributesMap } from 'ng-dynamic-component';
import { AppConfig } from '../app.config';
import { EditorialConvention, EditorialConventionLayouts } from '../models/evt-models';

// List of handled editorial convention
export type EditorialConventionDefaults = 'addition' | 'additionAbove' | 'additionBelow' | 'additionInline' | 'additionLeft' | 'additionRight' |
  'damage' | 'deletion' | 'sicCrux' | 'surplus' | 'sources' | 'analogues' | 'mod' ;

@Injectable({
  providedIn: 'root',
})
export class EditorialConventionsService {
  defaultLayouts: { [T in EditorialConventionDefaults]: Partial<EditorialConventionLayouts> } = {
    addition: {
      diplomatic: {
        style: {
          'background-color': '#bdecb6',
        },
      },
    },
    additionAbove: {
      interpretative: {
        pre: '\\',
        post: '/',
      },
      diplomatic: {
        style: {
          'vertical-align': 'super',
          'font-size': '.7rem',
          'background-color': '#bdecb6',
        },
      },
      changes: {
        style: {
          'vertical-align': 'super',
          'font-size': '.7rem',
        },
      },
    },
    additionBelow: {
      interpretative: {
        pre: '/',
        post: '\\',
      },
      diplomatic: {
        style: {
          'vertical-align': 'bottom',
          'font-size': '.7rem',
          'background-color': '#bdecb6',
        },
      },
      changes: {
        style: {
          'vertical-align': 'bottom',
          'font-size': '.7rem',
        },
      },
    },
    additionInline: {
      interpretative: {
        pre: '|',
        post: '|',
      },
      diplomatic: {
        style: {
          'background-color': '#bdecb6',
        },
      },
    },
    additionLeft: {
      interpretative: {
        post: '| |',
        style: {
          'margin-right': '-0.3rem',
        },
      },
      diplomatic: {
        style: {
          'margin-left': '-1rem',
          'background-color': '#bdecb6',
        },
      },
      changes: {
        style: {
          'margin-left': '-1rem',
        },
      },
    },
    additionRight: {
      interpretative: {
        pre: '| |',
        style: {
          'margin-left': '-0.3rem',
        },
      },
      diplomatic: {
        style: {
          'background-color': '#bdecb6',
        },
      },
    },
    damage: {
      diplomatic: {
        style: {
          'background-color': 'rgba(193, 193, 193, 0.7)',
        },
      },
      changes: {
        style: {
          'background-color': 'rgba(193, 193, 193, 0.7)',
        },
      },
    },
    deletion: {
      diplomatic: {
        style: {
          'background-color': '#fdd3d1',
          'text-decoration': 'line-through',
        },
      },
      interpretative: {
        pre: '[[',
        post: ']]',
      },
      changes: {
        style: {
          'text-decoration': 'line-through',
        },
      },
    },
    sicCrux: {
      diplomatic: {
        pre: '&dagger;',
        post: '&dagger;',
      },
      interpretative: {
        pre: '&dagger;',
        post: '&dagger;',
      },
      critical: {
        pre: '&dagger;',
        post: '&dagger;',
      },
      changes: {
        pre: '&dagger;',
        post: '&dagger;',
      },
    },
    surplus: {
      diplomatic: {
        pre: '{',
        post: '}',
        style: {
          'background-color': '#f6b26a',
        },
      },
    },
    'sources': {
      diplomatic: {
        style: {
          'font-style': 'italic',
          'font-size': '104%',
        },
      },
      interpretative: {
        style: {
          'font-style': 'italic',
          'font-size': '104%',
        },
      },
      critical: {
        style: {
          'font-style': 'italic',
          'font-size': '104%',
        },
      },
      changes: {
        style: {
          'font-style': 'italic',
          'font-size': '104%',
        },
      },
    },
    'analogues': {
      diplomatic: {
        pre: '🗎',
        style: {
          'text-decoration': 'underline dotted from-font',
        },
      },
      interpretative: {
        pre: '🗎',
        style: {
          'text-decoration': 'underline dotted from-font',
        },
      },
      critical: {
        pre: '🗎',
        style: {
          'text-decoration': 'underline dotted from-font',
        },
      },
      changes: {
        pre: '🗎',
        style: {
          'text-decoration': 'underline dotted from-font',
        },
      },
    },
    mod: {
      diplomatic: {
          style: {
          'background-color': '#bdecb6',
        },
      },
      critical: {
        style: {
          'background-color': '#bdecb6',
        },
      },
      interpretative: {
        style: {
          'background-color': '#bdecb6',
        },
      },
    },
  };

  getLayouts(name: string, attributes: AttributesMap, defaultsKey: EditorialConventionDefaults) {
    const excludedFromAttributeControl = ['sources', 'analogues'];
    const defaultKeys = this.defaultLayouts[defaultsKey];
    let layouts: Partial<EditorialConventionLayouts> = defaultKeys;

    const externalLayouts = this._getExternalConfigs().find((c) => c.element === name &&
      (excludedFromAttributeControl.includes(name) || !attributes || Object.keys(attributes).concat(
        Object.keys(c.attributes)).every((k) => attributes[k] === c.attributes[k])))?.layouts ?? undefined;

    if (externalLayouts) {
      layouts = {
        ...externalLayouts || {},
      }
    }

    return layouts;
  }

  private _getExternalConfigs(): EditorialConvention[] {
    const customs = AppConfig.evtSettings.editorialConventions;

    return Object.keys(customs).map((key) => ({
      element: customs[key].markup?.element ?? key,
      attributes: customs[key].markup?.attributes ?? {},
      layouts: customs[key].layouts ?? {},
    }));
  }
}
