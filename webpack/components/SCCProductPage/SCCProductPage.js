import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { PlusIcon } from '@patternfly/react-icons';
import SCCProductView from './components/SCCProductView/SCCProductView';
import EmptySccProducts from './EmptySccProducts';
import ProductSelector from './components/ProductSelector/ProductSelector';

const SCCProductPage = ({ canCreate, sccAccId, sccProductsInit, ...props }) => {
  const [selectOpen, setSelectOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(0);
  const openProductSelection = (evt) => {
    setSelectOpen(true);
  };

  const subscribeProducts = (sccProductIds) => {
    props.subscribeProductsAction(sccAccId, sccProductIds);
  };

  const editProductTree = (productId) => {
    setProductToEdit(productId);
    if (productId !== 0) {
      setSelectOpen(true);
    }
  };

  return sccProductsInit.length > 0 ? (
    <>
      <SCCProductView
        sccProducts={sccProductsInit.filter((prod) => prod.product_id !== null)}
        editProductTreeGlobal={editProductTree}
      />
      <br />
      <Button variant="link" icon={<PlusIcon />} onClick={openProductSelection}>
        {__('Add new SUSE products')}
      </Button>
      <br />
      {selectOpen && (
        <ProductSelector
          sccProducts={sccProductsInit}
          subscribeProducts={subscribeProducts}
          editProductId={productToEdit}
        />
      )}
    </>
  ) : (
    <EmptySccProducts sccAccountId={sccAccId} canCreate={canCreate} />
  );
};

SCCProductPage.propTypes = {
  canCreate: PropTypes.bool,
  sccAccId: PropTypes.number.isRequired,
  sccProducts: PropTypes.array,
  sccProductsInit: PropTypes.array,
};

SCCProductPage.defaultProps = {
  canCreate: false,
  sccAccId: undefined,
  sccProducts: [],
};

export default SCCProductPage;
