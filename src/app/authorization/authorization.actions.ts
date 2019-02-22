import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('authorization');

interface ILoginParams {
  login: string;
  password: string;
}

interface ILoginResult {
  token: string;
}

interface ILoginError {
  message: string;
}

export const Login = actionCreator.async<ILoginParams, ILoginResult, ILoginError>('Login');

export const Logout = actionCreator('Logout');
