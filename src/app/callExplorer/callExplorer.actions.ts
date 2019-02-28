import actionCreatorFactory from 'typescript-fsa';

import { Call, ApiError } from '../serverApi';

const actionCreator = actionCreatorFactory('explorer');

export const LoadAll = actionCreator.async<void, Call[], ApiError>('load all');
export const LoadOne = actionCreator.async<string, Call, ApiError>('load one');
export const Update = actionCreator.async<Call, Call, ApiError>('update');
