import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { createSelector } from '@ngrx/store';

import { State } from '../../../reducers';
import { AuthorizationStatus } from '../../authorization.reducer';
import { Login } from '../../authorization.actions';


export const selectAuthorization = (state: State) => state.authorization;

export const selectIsAuthorized = createSelector(
  selectAuthorization,
  authorization => authorization.status === AuthorizationStatus.Authorized
);


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private login = '';
  private password = '';

  constructor(private store: Store<State>) {
    console.log('store', store);
  }

  doLogin() {
    this.store.dispatch(Login.started({
      login: this.login,
      password: this.password
    }));
  }
}
