import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import GenericExpander from './GenericExpander';

const ProductTreeExpander = ({ setExpandAllInParent }) => {
  const selectOptionCollapse = __('Collapse products');
  const selectOptionExpand = __('Expand products');
  const initSelectionOption = __('Collapse/Expand');

  return (
    <>
      <GenericExpander
        setInParent={setExpandAllInParent}
        selectOptionOpen={selectOptionExpand}
        selectOptionClose={selectOptionCollapse}
        initLabel={initSelectionOption}
      />
    </>
  );
};

ProductTreeExpander.propTypes = {
  setExpandAllInParent: PropTypes.func.isRequired,
};

ProductTreeExpander.defaultProps = {};

export default ProductTreeExpander;
