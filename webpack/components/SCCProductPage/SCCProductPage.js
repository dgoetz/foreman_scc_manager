import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Stack, StackItem } from '@patternfly/react-core';
import SCCProductView from './components/SCCProductView';
import EmptySccProducts from './EmptySccProducts';
import SCCProductPicker from './components/SCCProductPicker';
import './sccProductPage.scss';

const SCCProductPage = ({
  canCreate,
  sccAccountId,
  sccProductsInit,
  ...props
}) => {
  const [productToEdit, setProductToEdit] = useState(0);
  const [subscriptionTaskId, setSubscriptionTaskId] = useState();

  const editProductTree = (productId) => {
    setProductToEdit(productId);
  };

  const handleSubscribeCallback = (subscriptionTaskIdFromChild) => {
    setSubscriptionTaskId(subscriptionTaskIdFromChild);
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
        <SCCProductPicker
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
  sccProductsInit: PropTypes.array,
};

SCCProductPage.defaultProps = {
  canCreate: false,
  sccProductsInit: [],
};

export default SCCProductPage;
