import { Injectable } from '@angular/core';
import { State } from '../reducers';

const storageKey = 'ngrx-app';

@Injectable()
export class StateSaver {
  public save(toSave: Partial<State>) {
    localStorage[storageKey] = JSON.stringify(toSave);
  }
}

export function getInitialState(): Partial<State> | undefined {
  const state = localStorage[storageKey];
  return state ? JSON.parse(state) : undefined;
}
