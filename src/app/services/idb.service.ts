import { Injectable } from '@angular/core';
import Dexie from 'dexie';

interface AnnotationID {
  annotationId: number;
}

@Injectable({
  providedIn: 'root',
})

export class IdbService extends Dexie {
  public db: Dexie.Table<AnnotationID, number>;
  constructor() {
    super('EVT-Annotator');
    this.version(1).stores({
      Annotations: '++id',
    });
    this.db = this.table('Annotations');
  }

  getAll() {
    return this.db.toArray();
  }

  add(data) {
    return this.db.add(data);
  }

  update(id, data) {
    return this.db.update(id, data);
  }

  remove(id) {
    return this.db.delete(id);
  }
}
