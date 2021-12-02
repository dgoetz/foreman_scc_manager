import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';

import { SCCPRODUCTPAGE_CHANGE_BOOL } from '../SCCProductPageConstants';
import reducer from '../SCCProductPageReducer';

const fixtures = {
  'should return the initial state': {},
  'should handle SCCPRODUCTPAGE_CHANGE_BOOL': {
    action: {
      type: SCCPRODUCTPAGE_CHANGE_BOOL,
      payload: {
        bool: true,
      },
    },
  },
};

describe('SCCProductPage reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
