import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  private form: FormGroup;

  constructor(
    private store: Store<State>,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      login: [null, [Validators.required]],
      password: [null, Validators.required],
    });
  }

  doLogin() {
    const { controls } = this.form;
    const login = controls.login.value;
    const password = controls.password.value;
    this.store.dispatch(Login.started({
      login,
      password
    }));
  }

  hasError(controlName: string) {
    return !this.form.controls[controlName].valid;
  }
}
