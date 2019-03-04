import { Observable } from 'rxjs';
import { AnyAction } from 'typescript-fsa';

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { marbles } from 'rxjs-marbles/jasmine';
import { StoreModule } from '@ngrx/store';

import { State, reducers } from '../reducers';
import { SaveState } from './localstorage.actions';
import { LocalStorageEffects } from './localstorage.effects';
import { StateSaver } from './stateSaver.service';

describe('LocalStorage Effects', () => {
  let effects: LocalStorageEffects;

  let actions: Observable<AnyAction>;

  let saver: StateSaver;

  let state: State;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          localization: () => state.localization,
          authorization: () => state.authorization,
        }),
      ],
      providers: [
        LocalStorageEffects,
        provideMockActions(() => actions),
        {
          provide: StateSaver,
          useFactory:  () => saver
        },
      ],
    });
  });

  describe('SaveState', () => {
    it('SaveState should save latest authorization and localization state at SaveState', marbles(m => {
      const initAction = {} as AnyAction;
      state = {
        authorization: {
          ...reducers.authorization(undefined, initAction),
          id: '1234'
        },
        localization: {
          ...reducers.localization(undefined, initAction),
          language: 'ru'
        },
        callExplorer: reducers.callExplorer(undefined, initAction),
        router: reducers.router(undefined, initAction),
      } as State;

      actions = m.cold('a--|', {
        a: SaveState(),
      });

      saver = {
        save: toSave => {
          expect(toSave).toEqual({
            authorization: state.authorization,
            localization: state.localization
          });
        }
      } as StateSaver;

      spyOn(saver, 'save').and.callThrough();

      effects = TestBed.get(LocalStorageEffects);
      m.expect(effects.save$).toBeObservable('---|');

      m.flush();
      expect(saver.save).toHaveBeenCalled();
    }));
  });
});
