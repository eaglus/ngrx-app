import actionCreatorFactory from 'typescript-fsa';

import { LoginResponse } from '../serverApi';

const actionCreator = actionCreatorFactory('authorization');

interface LoginParams {
  login: string;
  password: string;
}

interface LoginError {
  message: string;
}

export const Login = actionCreator.async<LoginParams, LoginResponse, LoginError>('Login');

export const Logout = actionCreator('Logout');
