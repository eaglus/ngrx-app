import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('explorer');

interface ILoadResult {
    data: any[];
}

interface ILoadError {
    message: string;
}

export const Load = actionCreator.async<void, ILoadResult, ILoadError>('load');
