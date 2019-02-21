import { Action } from '@ngrx/store';

export enum AuthorizationActionTypes {
  LoginStart = '[Authorization] login start',
  LoginDone = '[Authorization] login done',
  LoginFailed = '[Authorization] login failed',
  Logout = '[Authorization] logout',
}

export class LoginStart implements Action {
  readonly type = AuthorizationActionTypes.LoginStart;
  constructor(public login: string, public password: string) {}
}

export class LoginDone implements Action {
  readonly type = AuthorizationActionTypes.LoginDone;
  constructor(public token: string) {}
}

export class LoginFailed implements Action {
  readonly type = AuthorizationActionTypes.LoginFailed;
  constructor(public error: string) {}
}

export class Logout implements Action {
  readonly type = AuthorizationActionTypes.Logout;
}


export type AuthorizationActions = LoginStart | LoginDone | LoginFailed | Logout;
