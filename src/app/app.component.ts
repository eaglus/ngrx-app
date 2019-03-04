import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { MatSelectChange } from '@angular/material';

import { State } from './reducers';
import { Logout, selectIsAuthorized } from './authorization';
import { Navigate } from './routing';
import { languagesAvaiable, selectLanguage, SetLanguage } from './localization';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngrx-app';
  languages = languagesAvaiable;
  isAuthorized$ = this.store.pipe(select(selectIsAuthorized));
  language$ = this.store.pipe(select(selectLanguage));

  constructor(private store: Store<State>) {
  }

  doLogout() {
    this.store.dispatch(Logout.started());
  }

  onTitleClick() {
    this.store.dispatch(Navigate(['']));
  }

  onLanguageChange($event: MatSelectChange) {
    this.store.dispatch(SetLanguage($event.value));
  }
}
