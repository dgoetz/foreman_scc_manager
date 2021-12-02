import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import SCCProductPage from '../SCCProductPage';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('SCCProductPage', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(SCCProductPage, fixtures));
});
