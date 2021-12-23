import React, { useState } from 'react';
import { Icon } from 'patternfly-react';
import PropTypes from 'prop-types';
import SCCRepoView from './SCCRepoView';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanUrl } from 'foremanReact/common/helpers';
import {
  TreeView,
  Button,
  Card,
  CardTitle,
  CardBody,
  Tooltip,
} from '@patternfly/react-core';
import { BrowserRouter, Link } from 'react-router-dom';
import { cloneDeep, filter, clone } from 'lodash';

const addCheckBoxToTree = (tree) => {
  const checkProps = {};
  checkProps.checked = tree.product_id !== null;
  checkProps.disabled = true;
  tree.checkProps = checkProps;
};

const addKatelloLinkToTree = (tree) => {
  const url = foremanUrl(`/products/${tree.product_id}`);
  // Link component needs to be wrapped in a Router
  tree.customBadgeContent.push(
<<<<<<< HEAD
    <BrowserRouter>
      <Link to={url}>
        <Tooltip content={__('Go to Product page')}>
          <Button variant="plain" id="tt-ref">
            <Icon name="external-link" type="fa" />
          </Button>
        </Tooltip>
      </Link>
    </BrowserRouter>
=======
    <>
      <BrowserRouter>
        <Link to={url}>
          <Tooltip content={__('Go to Product page')}>
            <Button variant="plain" id="tt-ref">
              <Icon name="external-link" type="fa" />
            </Button>
          </Tooltip>
        </Link>
      </BrowserRouter>
    </>
>>>>>>> 0e5b7e5 (Add repositories to product view)
  );
  return tree;
};

<<<<<<< HEAD
const addEditIcon = (tree, editProductTree) => {
  tree.customBadgeContent.push(
    <Tooltip content={__('Add more sub products to Product tree')}>
      <Button
        variant="plain"
        id={tree.id.toString()}
        onClick={(evt) => editProductTree(evt, tree.id)}
      >
        <Icon name="edit" type="pf" size="2x" />
      </Button>
    </Tooltip>
=======
const addEditIcon = (tree) => {
  tree.customBadgeContent.push(
    <>
      <Tooltip content={__('Add more sub products to Product tree')}>
        <Button variant="plain" id="tt-ref">
          <Icon name="edit" type="pf" size="2x" />
        </Button>
      </Tooltip>
    </>
>>>>>>> 0e5b7e5 (Add repositories to product view)
  );

  return tree;
};

const addReposToTree = (tree) => {
  tree.customBadgeContent.push(
<<<<<<< HEAD
    <Tooltip content={__('Show currently added repositories')}>
      <SCCRepoView
        sccRepos={tree.scc_repositories}
        sccProductId={tree.product_id}
      />
    </Tooltip>
=======
    <SCCRepoView
      sccRepos={tree.scc_repositories}
      sccProductId={tree.product_id}
    />
>>>>>>> 0e5b7e5 (Add repositories to product view)
  );
  return tree;
};

const addValidationStatusToTree = (tree) => {
  tree.customBadgeContent.push(
    <>
      <Tooltip content={__('Please check your SUSE subscription')}>
        <Button variant="plain" id="tt-ref">
          <Icon name="warning-triangle-o" type="pf" size="2x" />
        </Button>
      </Tooltip>
    </>
  );
  return tree;
};

const setupTreeViewListItem = (tree, isRoot) => {
  tree.customBadgeContent = [];
  if (!tree.subscription_valid) addValidationStatusToTree(tree);
  addReposToTree(tree);
  addCheckBoxToTree(tree);
  if (tree.product_id !== null) {
    addKatelloLinkToTree(tree);
    if (isRoot === true) {
      addEditIcon(tree);
    }
  }
  if ('children' in tree) {
    tree.children = tree.children.map(setupTreeViewListItem, false);
  }
  return tree;
};

const filterDeep = (tree) => {
  if (tree.product_id !== null) {
    const filtered = clone(tree);
    if ('children' in tree) {
      filtered.children = filter(
        tree.children,
        (child) => child.product_id !== null
      ).map(filterDeep);
      if (filtered.children.length === 0) {
        delete filtered.children;
      }
    }
    return filtered;
  }
  return null;
};

const SCCProductView = ({ sccProducts }) => {
  const sccProductsClone = cloneDeep(sccProducts);
  const [allExpanded, setAllExpanded] = useState(false);
  // wrap actual iterator function into anonymous function to pass extra parameters
  const [allProducts, setAllProducts] = useState(
    sccProductsClone.map((tree) => setupTreeViewListItem(tree, true))
  );
  const [subscribedProducts, setSubscribedProducts] = useState(null);
  const [showAll, setShowAll] = useState(true);

  const collapseAll = (evt) => {
    setAllExpanded(false);
  };

  const expandAll = (evt) => {
    setAllExpanded(true);
  };

  const showFullTree = (evt) => {
    setShowAll(true);
  };

  const showSubscribed = (evt) => {
    setShowAll(false);
    if (subscribedProducts === null) {
      const test = allProducts.map(filterDeep);
      setSubscribedProducts(test);
    }
  };

  return (
    <Card>
      <CardTitle>{__('Subscribed SCC Products')}</CardTitle>
      {sccProducts.length > 0 && (
        <CardBody>
          <Button variant="link" onClick={collapseAll}>
            {__('Collapse all')}
          </Button>
          <Button variant="link" onClick={expandAll}>
            {__('Expand all')}
          </Button>

          <Button variant="link" onClick={showFullTree}>
            {__('Show all')}
          </Button>
          <Button variant="link" onClick={showSubscribed}>
            {__('Show subscribed only')}
          </Button>
          <TreeView
            data={showAll ? allProducts : subscribedProducts}
            allExpanded={allExpanded}
            hasChecks
            hasBadges
            hasGuides
          />
        </CardBody>
      )}
      {sccProducts.length === 0 && (
        <CardBody>
          {__(
            'No SCC products imported. Please add new products by pressing the button below.'
          )}
        </CardBody>
      )}
    </Card>
  );
};

SCCProductView.propTypes = {
  sccProducts: PropTypes.array,
};

SCCProductView.defaultProps = {
  sccProducts: undefined,
};

export default SCCProductView;
