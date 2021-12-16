import React, { useState } from 'react';
import PropTypes from 'prop-types';
import GenericSelector from './GenericSelector';
import TreeSelector from './TreeSelector';
import { Button, Card, CardTitle, CardBody } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { uniq } from 'lodash';

const genericFilter = (object, comparator) =>
  // we can have architectures that are not set
  comparator === '' ||
  object === comparator ||
  (object === null && comparator === 'no arch');

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
  const [productItems, setProductItems] = useState(
    uniq(sccProducts.map((p) => p.product_category))
  );
  const [selectedProduct, setSelectedProduct] = useState('');
  const [archItems, setArchItems] = useState([]);
  const [selectedArch, setSelectedArch] = useState('');
  const [versionItems, setVersionItems] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState('');
  const [filteredSccProducts, setFilteredSccProducts] = useState([]);
  const [showSearchTree, setShowSearchTree] = useState(false);

  const onProductSelectionChange = (value) => {
    setSelectedProduct(value);
    setVersionItems(filterVersionByProduct(sccProducts, value));
    setArchItems([]);
    setSelectedVersion('');
    setSelectedArch('');
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
  const filterProducts = (evt) => {
    setShowSearchTree(true);
    setFilteredSccProducts(
      sccProducts.filter(
        (p) =>
          genericFilter(p.product_category, selectedProduct) &&
          genericFilter(p.arch, selectedArch) &&
          genericFilter(p.version, selectedVersion)
      )
    );
  };

  return (
    <Card>
      <CardTitle>{__('SCC Product Selection')}</CardTitle>
      <CardBody>
        <GenericSelector
          key="prod-select"
          selectionItems={productItems}
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
        <Button variant="primary" onClick={filterProducts}>
          {__('Search')}
        </Button>{' '}
        <br />
        <br />
        {showSearchTree && <TreeSelector sccProducts={filteredSccProducts} />}
      </CardBody>
    </Card>
  );
};

ProductSelector.propTypes = {
  sccProducts: PropTypes.array,
};

ProductSelector.defaultProps = {
  sccProducts: [],
};

export default ProductSelector;
