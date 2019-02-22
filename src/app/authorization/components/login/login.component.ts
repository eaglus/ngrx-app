import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { createSelector } from '@ngrx/store';

import { State } from '../../../reducers';
import { AuthorizationStatus } from '../../authorization.reducer';


export const selectAuthorization = (state: State) => state.authorization;

export const selectIsAuthorized = createSelector(
  selectAuthorization,
  authorization => authorization.status === AuthorizationStatus.Authorized
);


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private store: Store<State>) {
    console.log('store', store);
  }
}
