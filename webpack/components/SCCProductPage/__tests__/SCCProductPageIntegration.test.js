import React from 'react';
import { IntegrationTestHelper } from 'react-redux-test-utils';

import SCCProductPage, { reducers } from '../index';

describe('SCCProductPage integration test', () => {
  it('should flow', async () => {
    const integrationTestHelper = new IntegrationTestHelper(reducers);
    const component = integrationTestHelper.mount(<SCCProductPage />);
    component.update();
    /** Create a Flow test */
  });
});
