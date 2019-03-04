import { Call, ApiError, ApiErrorCode } from '../serverApi';
import {
  reducer,
  initialState,
  LoadStatus,
} from './callExplorer.reducer';
import { LoadAll, LoadOne, Update } from './callExplorer.actions';

describe('Call explorer reducer', () => {

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('LoadAll', () => {
    it('LoadAll.started should set loading state for initial state', () => {
      const result = reducer(initialState, LoadAll.started);
      expect(result).toEqual({
        ...initialState,
        status: LoadStatus.Loading
      });
    });

    it('LoadAll.started should not change state with status LoadStatus.LoadedAll', () => {
      const startState = {
        ...initialState,
        status: LoadStatus.LoadedAll
      };

      const result = reducer(startState, LoadAll.started);
      expect(result).toBe(startState);
    });

    it('LoadAll.done should set calls, and set LoadedAll status', () => {
      const expectedState = {
        ...initialState,
        status: LoadStatus.LoadedAll,
        calls: [{} as Call]
      };

      const result = reducer(initialState, LoadAll.done({
        params: undefined,
        result: [{} as Call]
      }));

      expect(result).toEqual(expectedState);
    });

    it('LoadAll.failed should set error status', () => {
      const expectedState = {
        ...initialState,
        status: LoadStatus.Error,
        error: 'error'
      };

      const result = reducer(initialState, LoadAll.failed({
        params: undefined,
        error: new ApiError('error', ApiErrorCode.Unknown)
      }));

      expect(result).toEqual(expectedState);
    });
  });

  describe('LoadOne', () => {
    it('LoadOne.started should set loading state for initial state', () => {
      const result = reducer(initialState, LoadOne.started);
      expect(result).toEqual({
        ...initialState,
        status: LoadStatus.Loading
      });
    });

    it('LoadOne.started should not change state with status LoadStatus.LoadedAll', () => {
      const startState = {
        ...initialState,
        status: LoadStatus.LoadedAll
      };

      const result = reducer(startState, LoadOne.started);
      expect(result).toBe(startState);
    });

    describe('LoadOne.done', () => {
      const callId = 123;
      const id = '321';
      const newCall = {
        data: {
          callId,
          id
        }
      } as Call;

      const oldCall = {
        data: {
          callId: 234,
          id: '432'
        }
      } as Call;

      const startState = {
        ...initialState,
        status: LoadStatus.LoadedPartial,
        calls: [oldCall]
      };

      it('LoadOne.done should append new call and set status', () => {
        const expectedState = {
          ...initialState,
          status: LoadStatus.LoadedPartial,
          calls: [oldCall, newCall]
        };

        const result = reducer(startState, LoadOne.done({
          params: id,
          result: newCall
        }));

        expect(result).toEqual(expectedState);
      });

      it('LoadOne.done should update existed call and set status', () => {
        const expectedState = {
          ...initialState,
          status: LoadStatus.LoadedPartial,
          calls: [oldCall]
        };

        const result = reducer(startState, LoadOne.done({
          params: id,
          result: oldCall
        }));

        expect(result).toEqual(expectedState);
      });
    });

    it('LoadOne.failed should set error status', () => {
      const expectedState = {
        ...initialState,
        status: LoadStatus.Error,
        error: 'error'
      };

      const result = reducer(initialState, LoadOne.failed({
        params: undefined,
        error: new ApiError('error', ApiErrorCode.Unknown)
      }));

      expect(result).toEqual(expectedState);
    });
  });

  describe('Update', () => {
    const call = {
      data: {
        id: '123',
        callId: 321
      },
      isUpdating: false
    } as Call;

    const startState = {
      ...initialState,
      status: LoadStatus.LoadedAll,
      calls: [call]
    };

    it('Update.started should set updating state for specified call', () => {
      const expectedState = {
        ...startState,
        calls: [
          {
            ...call,
            isUpdating: true
          }
        ]
      };

      const result = reducer(startState, Update.started(call));
      expect(result).toEqual(expectedState);
    });

    it('Update.done should set new data for specified call', () => {
      const newCall = {
        data: {
          ...call.data,
          callWrapups: [
            {
              wrapupComment: 'wrapupComment'
            }
          ]
        },
        isUpdating: false
      } as Call;

      const expectedState = {
        ...startState,
        calls: [newCall]
      };

      const result = reducer(startState, Update.done({
        params: call,
        result: newCall
      }));

      expect(result).toEqual(expectedState);
    });

    it('Update.failed should set error state', () => {
      const expectedState = {
        ...startState,
        status: LoadStatus.Error,
        error: 'error'
      };

      const result = reducer(startState, Update.failed({
        params: call,
        error: {
          message: 'error',
          code: ApiErrorCode.Unknown
        }
      }));

      expect(result).toEqual(expectedState);
    });
  });
});
