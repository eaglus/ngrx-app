import {
  reducer,
  initialState,
} from './localization.reducer';
import { SetLanguage } from './localization.actions';

describe('Authorization Reducer', () => {

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('SetLanguage', () => {
    it('SetLanguage should set language to state', () => {
      const result = reducer(initialState, SetLanguage('ru'));

      expect(result).toEqual({
        ...initialState,
        language: 'ru'
      });
    });
  });
});
