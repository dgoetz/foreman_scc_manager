import React from 'react';
import PropTypes from 'prop-types';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import SCCProductView from './components/SCCProductView/SCCProductView';

const SCCProductPage = ({ sccAccId, sccProductsInit, ...props }) => (
  <SCCProductView sccProducts={sccProductsInit} />
);

SCCProductPage.propTypes = {
  sccAccId: PropTypes.number.isRequired,
  sccProducts: PropTypes.array,
  sccProductsInit: PropTypes.array,
  fetchProducts: PropTypes.func,
};

SCCProductPage.defaultProps = {
  sccAccId: undefined,
  sccProducts: undefined,
};

export default SCCProductPage;
