import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { selectSCCProductPage, selectBool } from '../SCCProductPageSelectors';

const state = {
  sccProductPage: {
    bool: false,
  },
};

const fixtures = {
  'should return SCCProductPage': () => selectSCCProductPage(state),
  'should return SCCProductPage bool': () => selectBool(state),
};

describe('SCCProductPage selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
