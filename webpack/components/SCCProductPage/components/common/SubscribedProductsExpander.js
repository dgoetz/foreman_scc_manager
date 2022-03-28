import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import GenericExpander from './GenericExpander';

const SubscribedProductsExpander = ({ setExpandAllInParent }) => {
  const selectOptionSubscribedOnly = __('Show only subscribed products');
  const selectOptionShowAll = __('Show all products');
  const initSelectionOption = __('Show/Hide unsubscribed');

  return (
    <>
      <GenericExpander
        setInParent={setExpandAllInParent}
        selectOptionOpen={selectOptionShowAll}
        selectOptionClose={selectOptionSubscribedOnly}
        initLabel={initSelectionOption}
      />
    </>
  );
};

SubscribedProductsExpander.propTypes = {
  setExpandAllInParent: PropTypes.func.isRequired,
};

SubscribedProductsExpander.defaultProps = {};

export default SubscribedProductsExpander;
