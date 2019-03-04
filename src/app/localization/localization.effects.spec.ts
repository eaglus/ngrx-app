import { Observable } from 'rxjs';
import { AnyAction } from 'typescript-fsa';
import { StoreModule } from '@ngrx/store';

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { marbles } from 'rxjs-marbles/jasmine';
import { TranslateService } from '@ngx-translate/core';

import { SaveState } from '../localStorage';
import { SetLanguage } from './localization.actions';
import { StateSegment } from './localization.reducer';
import { LocalizationEffects } from './localization.effects';

describe('Localization Effects', () => {
  let effects: LocalizationEffects;

  let actions: Observable<AnyAction>;

  const translate = {
    getBrowserLang: () => {
      return 'ru';
    },
    use: (language: string) => {
      expect(language).toBe('ru');
    }
  } as TranslateService;

  let state: StateSegment;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          localization: () => state && state.localization,
        }),
      ],
      providers: [
        LocalizationEffects,
        provideMockActions(() => actions),
        {
          provide: TranslateService,
          useFactory:  () => translate
        },
      ],
    });
  });

  it('SetLanguage should save state after change language', marbles(m => {
      actions = m.cold('a--|', {
        a: SetLanguage('ru'),
      });

      spyOn(translate, 'use').and.callThrough();

      effects = TestBed.get(LocalizationEffects);
      m.expect(effects.setLanguage$).toBeObservable('a--|', {
        a: SaveState()
      });

      m.flush();
      expect(translate.use).toHaveBeenCalled();
  }));

  it('SetLanguage should set browser language at start if no language saved in store', marbles(m => {
    state = {
      localization: {
        language: undefined
      }
    };

    spyOn(translate, 'getBrowserLang').and.callThrough();

    effects = TestBed.get(LocalizationEffects);
    m.expect(effects.initialize$).toBeObservable('(a|)', {
      a: SetLanguage('ru')
    });

    m.flush();
    expect(translate.getBrowserLang).toHaveBeenCalled();
  }));

  it('SetLanguage should use saved language at start if language saved in store', marbles(m => {
    state = {
      localization: {
        language: 'en'
      }
    };

    spyOn(translate, 'getBrowserLang').and.callThrough();

    effects = TestBed.get(LocalizationEffects);
    m.expect(effects.initialize$).toBeObservable('(a|)', {
      a: SetLanguage('en')
    });

    m.flush();
    expect(translate.getBrowserLang).toHaveBeenCalled();
  }));
});
