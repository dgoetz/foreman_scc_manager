import React, { useState } from 'react';
import PropTypes from 'prop-types';
import GenericSelector from './GenericSelector';
import { Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { uniq } from 'lodash';

const filterVersionByProduct = (sccProducts, product) =>
  uniq(
    sccProducts
      .filter((p) => p.product_category === product)
      .map((i) => i.version)
  ).sort();

const filterArchByVersionAndProduct = (sccProducts, product, version) =>
  uniq(
    sccProducts
      .filter((p) => p.product_category === product && p.version === version)
      .map((i) => i.arch)
  ).sort();
const ProductSelector = ({ sccProducts }) => {
  const productCategories = uniq(sccProducts.map((p) => p.product_category));

  const [selectedProduct, setSelectedProduct] = useState();
  const [archItems, setArchItems] = useState([]);
  const [selectedArch, setSelectedArch] = useState([]);
  const [versionItems, setVersionItems] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState([]);

  const onProductSelectionChange = (value) => {
    setSelectedProduct(value);
    setVersionItems(filterVersionByProduct(sccProducts, value));
  };
  const onVersionSelectionChange = (value) => {
    setSelectedVersion(value);
    setArchItems(
      filterArchByVersionAndProduct(sccProducts, selectedProduct, value)
    );
  };
  const onArchSelectionChange = (value) => {
    setSelectedArch(value);
  };

  return (
    <React.Fragment>
      <GenericSelector
        key="prod-select"
        selectionItems={productCategories}
        setGlobalSelected={onProductSelectionChange}
        screenReaderLabel={__('Product selection')}
        initialLabel={__('Select Product')}
      />{' '}
      <GenericSelector
        key="vers-select"
        selectionItems={versionItems}
        setGlobalSelected={onVersionSelectionChange}
        screenReaderLabel={__('Version selection')}
        initialLabel={__('Select Version')}
      />
      <GenericSelector
        key="arch-select"
        selectionItems={archItems}
        setGlobalSelected={onArchSelectionChange}
        screenReaderLabel={__('Architecture selection')}
        initialLabel={__('Select Architecture')}
      />{' '}
      <br />
      <br />
      <br />
      <br />
      <Button variant="primary">{__('Search')}</Button>{' '}
    </React.Fragment>
  );
};

ProductSelector.propTypes = {
  sccProducts: PropTypes.array,
};

ProductSelector.defaultProps = {
  sccProducts: [],
};

export default ProductSelector;
