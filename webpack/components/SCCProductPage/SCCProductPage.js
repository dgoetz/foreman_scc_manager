import React from 'react';
import PropTypes from 'prop-types';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import SCCProductView from './components/SCCProductView/SCCProductView';
import EmptySccProducts from './EmptySccProducts';

const SCCProductPage = ({ canCreate, sccAccId, sccProductsInit, ...props }) =>
  sccProductsInit.length > 0 ? (
    <SCCProductView sccProducts={sccProductsInit} />
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
  sccProducts: undefined,
};

export default SCCProductPage;
