import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import EmptyState from 'foremanReact/components/common/EmptyState';
import { foremanUrl } from 'foremanReact/common/helpers';

export const EmptySccProducts = ({ canCreate, sccAccountId }) => {
  const action = canCreate && {
    title: __('Synchronize SUSE Account'),
    url: foremanUrl(`/scc_accounts/${sccAccountId}/sync`),
  };

  const content = __(
    `Please synchronize your SUSE account before you can subscribe to SUSE products.`
  );
  return (
    <EmptyState
      icon="th"
      iconType="fa"
      header={__('SUSE Customer Center')}
      description={<div dangerouslySetInnerHTML={{ __html: content }} />}
      documentation={{
        url: 'https://docs.orcharhino.com/or/docs/sources/usage_guides/managing_sles_systems_guide.html#mssg_adding_scc_accounts',
      }}
      action={action}
    />
  );
};

EmptySccProducts.propTypes = {
  canCreate: PropTypes.bool,
  sccAccountId: PropTypes.number,
};

EmptySccProducts.defaultProps = {
  canCreate: false,
  sccAccountId: undefined,
};

export default EmptySccProducts;
