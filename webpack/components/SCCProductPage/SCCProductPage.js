import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import SCCProductView from './components/SCCProductView/SCCProductView';
import EmptySccProducts from './EmptySccProducts';
import ProductSelector from './components/ProductSelector/ProductSelector';

const SCCProductPage = ({ canCreate, sccAccId, sccProductsInit, ...props }) =>
  sccProductsInit.length > 0 ? (
    <>
      <SCCProductView
        sccProducts={sccProductsInit.filter((prod) => prod.product_id !== null)}
      />
      <br />
      <Button variant="link" icon={<PlusCircleIcon />}>
        {__('Add new SUSE products')}
      </Button>
      <br />
      <br />
      <br />
      <ProductSelector sccProducts={sccProductsInit} />
    </>
  ) : (
    <EmptySccProducts sccAccountId={sccAccId} canCreate={canCreate} />
  );

SCCProductPage.propTypes = {
  canCreate: PropTypes.bool,
  sccAccId: PropTypes.number.isRequired,
  sccProducts: PropTypes.array,
  sccProductsInit: PropTypes.array,
  fetchProducts: PropTypes.func,
};

SCCProductPage.defaultProps = {
  canCreate: false,
  sccAccId: undefined,
  sccProducts: [],
};

export default SCCProductPage;
