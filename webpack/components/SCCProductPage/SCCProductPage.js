import React from 'react';
import PropTypes from 'prop-types';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';

const SCCProductPage = ({ scc_acc_id, scc_products_init, ...props }) => {

SCCProductPage.propTypes = {
  scc_acc_id: PropTypes.number.isRequired,
  scc_products: PropTypes.array,
  scc_products_init: PropTypes.object,
  fetchProducts: PropTypes.func,
};

SCCProductPage.defaultProps = {
  scc_acc_id: undefined,
  scc_products: undefined,
};

export default SCCProductPage;
