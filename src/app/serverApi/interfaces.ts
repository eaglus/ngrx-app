export interface LoginResponse {
  id: string;
  ttl: number;
  created: string;
  userId: string;
}

export interface CallWrapupAgent {
  id: number;
  login: string;
}

export interface CallWrapup {
  agent: CallWrapupAgent;
  wrapupName: string;
  wrapupComment: string;
}

export interface CallData {
  id: string;
  callId: number;
  callStart: string;
  callDuration: number;
  callWrapups: CallWrapup[];
}

export interface Call {
  data: CallData;
  isUpdating: boolean;
}

export enum ApiErrorCode {
  Unauthorized,
  Unknown
}

export class ApiError {
  constructor(public message: string, public code: ApiErrorCode) {}
}

export const UNAUTHORIZED_CODE = 401;

export interface ApiErrorResponse {
  error: {
    error: {
      code: string;
      message: string;
      name: string;
      statusCode: number;
    }
  };
}
