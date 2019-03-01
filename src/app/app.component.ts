import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import {State} from './reducers';
import { AuthorizationStatus, Logout } from './authorization';


export const selectAuthorization = (state: State) => state.authorization;

export const selectIsAuthorized = createSelector(
  selectAuthorization,
  authorization => authorization.status === AuthorizationStatus.Authorized
);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngrx-app';
  isAuthorized$ = this.store.pipe(select(selectIsAuthorized));

  constructor(private store: Store<State>, translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('ru');
  }

  doLogout() {
    this.store.dispatch(Logout.started());
  }
}
