import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('routing');

export const Navigate = actionCreator<[string, ...any[]]>('navigate');
export const navigateToLogin = Navigate(['login']);
