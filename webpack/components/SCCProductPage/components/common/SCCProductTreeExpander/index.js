import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import SCCGenericExpander from '../SCCGenericExpander';

const SCCProductTreeExpander = ({ setExpandAllInParent }) => {
  const selectOptionCollapse = __('Collapse products');
  const selectOptionExpand = __('Expand products');
  const initSelectionOption = __('Collapse/Expand');

  return (
    <>
      <SCCGenericExpander
        setInParent={setExpandAllInParent}
        selectOptionOpen={selectOptionExpand}
        selectOptionClose={selectOptionCollapse}
        initLabel={initSelectionOption}
      />
    </>
  );
};

SCCProductTreeExpander.propTypes = {
  setExpandAllInParent: PropTypes.func.isRequired,
};

SCCProductTreeExpander.defaultProps = {};

export default SCCProductTreeExpander;
