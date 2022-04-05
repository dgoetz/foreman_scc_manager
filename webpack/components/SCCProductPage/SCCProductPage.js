import './sccProductPage.scss';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button, Stack, StackItem } from '@patternfly/react-core';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { TimesCircleIcon } from '@patternfly/react-icons';
import SCCProductView from './components/SCCProductView/SCCProductView';
import EmptySccProducts from './EmptySccProducts';
import ProductSelector from './components/ProductSelector/ProductSelector';

const SCCProductPage = ({
  canCreate,
  sccAccountId,
  sccProductsInit,
  ...props
}) => {
  const dispatch = useDispatch();
  const [productToEdit, setProductToEdit] = useState(0);
  const [subscriptionTaskId, setSubscriptionTaskId] = useState();
  const openProductSelection = (evt) => {
    setSelectOpen(true);
  };

  const editProductTree = (productId) => {
    setProductToEdit(productId);
    if (productId !== 0) {
      setSelectOpen(true);
    }
  };

  const handleSubscribeCallback = (subscriptionTaskId) => {
    setSubscriptionTaskId(subscriptionTaskId);
  };

  return sccProductsInit.length > 0 ? (
    <Stack>
      <StackItem>
        <SCCProductView
          sccProducts={sccProductsInit.filter(
            (prod) => prod.product_id !== null
          )}
          subscriptionTaskId={subscriptionTaskId}
          editProductTreeGlobal={editProductTree}
        />
      </StackItem>
      <br />
      <StackItem />
      <StackItem>
        <ProductSelector
          sccProducts={sccProductsInit}
          sccAccountId={sccAccountId}
          editProductId={productToEdit}
          handleSubscribeCallback={handleSubscribeCallback}
        />
      </StackItem>
    </Stack>
  ) : (
    <EmptySccProducts sccAccountId={sccAccountId} canCreate={canCreate} />
  );
};

SCCProductPage.propTypes = {
  canCreate: PropTypes.bool,
  sccAccountId: PropTypes.number.isRequired,
  sccProducts: PropTypes.array,
  sccProductsInit: PropTypes.array,
};

SCCProductPage.defaultProps = {
  canCreate: false,
  sccProducts: [],
};

export default SCCProductPage;
