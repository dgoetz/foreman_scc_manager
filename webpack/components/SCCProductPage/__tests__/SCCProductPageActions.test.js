import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { changeBool } from '../SCCProductPageActions';

const fixtures = {
  'should changeBool': () => changeBool({ bool: true }),
};

describe('SCCProductPage actions', () =>
  testActionSnapshotWithFixtures(fixtures));
