import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, tap, map, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { SaveState } from '../localStorage';
import { SetLanguage } from './localization.actions';
import { languagesAvaiable, defaultLanguageCode, StateSegment } from './localization.reducer';
import { selectLanguage } from './localization.selector';

@Injectable()
export class LocalizationEffects {

  language$ = this.store.pipe(map(selectLanguage));

  @Effect()
  setLanguage$ = this.actions$.pipe(
    filter(SetLanguage.match),
    tap(action => this.translate.use(action.payload)),
    map(() => SaveState())
  );

  @Effect()
  initialize$ = this.language$.pipe(
    take(1),
    map(savedLanguage => {
      const browserLanguage = this.translate.getBrowserLang();

      const usedLang = 
        savedLanguage ||
          (
            languagesAvaiable.some(item => item.code === browserLanguage)
            ? browserLanguage
            : defaultLanguageCode
          );
  
      return SetLanguage(usedLang);
    })
  )

  constructor(
    private actions$: Actions,
    private translate: TranslateService,
    private store: Store<StateSegment>,
  ) {
  }
}
