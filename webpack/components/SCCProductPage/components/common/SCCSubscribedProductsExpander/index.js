import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import SCCGenericExpander from '../SCCGenericExpander';

const SCCSubscribedProductsExpander = ({ setExpandAllInParent }) => {
  const selectOptionSubscribedOnly = __('Show only subscribed products');
  const selectOptionShowAll = __('Show all products');
  const initSelectionOption = __('Show/Hide unsubscribed');

  return (
    <>
      <SCCGenericExpander
        setInParent={setExpandAllInParent}
        selectOptionOpen={selectOptionShowAll}
        selectOptionClose={selectOptionSubscribedOnly}
        initLabel={initSelectionOption}
      />
    </>
  );
};

SCCSubscribedProductsExpander.propTypes = {
  setExpandAllInParent: PropTypes.func.isRequired,
};

SCCSubscribedProductsExpander.defaultProps = {};

export default SCCSubscribedProductsExpander;
