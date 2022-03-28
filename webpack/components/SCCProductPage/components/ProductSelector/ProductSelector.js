import './ProductSelector.scss';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import GenericSelector from './GenericSelector';
import TreeSelector from './TreeSelector';
import {
  Button,
  Card,
  CardTitle,
  CardBody,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
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

const ProductSelector = ({ sccProducts, sccAccountId, editProductId }) => {
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

  useEffect(() => {
    if (editProductId !== 0) {
      // the id is unique, so there never should be more than 1 element in the array
      const product = sccProducts.filter((p) => p.id === editProductId);
      if (product.length > 0) {
        setSelectedProduct(product[0].product_category);
        setSelectedArch(product[0].arch);
        setSelectedVersion(product[0].version);
        setFilteredSccProducts(product);
        setShowSearchTree(true);
      }
    }
  }, [editProductId, sccProducts]);

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
        <Flex direction={{ default: 'column' }}>
          <Flex>
            <FlexItem>
              <GenericSelector
                key="prod-select"
                selectionItems={productItems}
                setGlobalSelected={onProductSelectionChange}
                screenReaderLabel={__('Product selection')}
                initialLabel={
                  selectedProduct === ''
                    ? __('Select Product')
                    : selectedProduct
                }
              />
            </FlexItem>
            <FlexItem>
              <GenericSelector
                key="vers-select"
                selectionItems={versionItems}
                setGlobalSelected={onVersionSelectionChange}
                screenReaderLabel={__('Version selection')}
                initialLabel={
                  selectedVersion === ''
                    ? __('Select Version')
                    : selectedVersion
                }
              />
            </FlexItem>
            <FlexItem>
              <GenericSelector
                key="arch-select"
                selectionItems={archItems}
                setGlobalSelected={onArchSelectionChange}
                screenReaderLabel={__('Architecture selection')}
                initialLabel={
                  selectedArch === '' ? __('Select Architecture') : selectedArch
                }
              />
            </FlexItem>
          </Flex>
          <Flex>
            <FlexItem>
              <Button variant="primary" onClick={filterProducts}>
                {__('Search')}
              </Button>
            </FlexItem>
          </Flex>
          <FlexItem>
            {showSearchTree && (
              <TreeSelector
                sccProducts={filteredSccProducts}
                sccAccountId={sccAccountId}
              />
            )}
          </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
};

ProductSelector.propTypes = {
  sccProducts: PropTypes.array,
  sccAccountId: PropTypes.number.isRequired,
  editProductId: PropTypes.number,
};

ProductSelector.defaultProps = {
  sccProducts: [],
  editProductId: 0,
};

export default ProductSelector;
