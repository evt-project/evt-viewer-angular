import { Component, Input } from '@angular/core';
import { NamedEntityInfo } from '../../../models/evt-models';
import { register } from '../../../services/component-register.service';

@Component({
  selector: 'evt-named-entity-detail',
  templateUrl: './named-entity-detail.component.html',
  styleUrls: ['./named-entity-detail.component.scss'],
})
@register(NamedEntityInfo)
export class NamedEntityDetailComponent {
  @Input() data: NamedEntityInfo;

  iconData = {
    actors: { icon: 'users' },
    birth: { icon: 'birthday-cake' },
    bloc: { icon: 'map-marker' },
    country: { icon: 'map-marker' },
    death: { icon: 'times', rotate: 45 },
    district: { icon: 'map-marker' },
    geogFeat: { icon: 'map-marker' },
    geoname: { icon: 'map-marker' },
    idno: { icon: 'barcode' },
    note: { icon: 'sticky-note' },
    occupation: { icon: 'briefcase' },
    orgname: { icon: 'users' },
    persname: { icon: 'user' },
    placename: { icon: 'map-marker' },
    region: { icon: 'map-marker' },
    relations: { icon: 'share-alt' },
    residence: { icon: 'home' },
    settlement: { icon: 'location-arrow' },
    sex: { icon: 'venus-mars' },
  };

  defaultIcon = { icon: 'info-circle' };
}
