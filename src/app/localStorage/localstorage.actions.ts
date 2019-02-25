import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('localStorage');

export const SaveState = actionCreator('saveState');
