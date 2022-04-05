import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  TreeView,
  Button,
  Tooltip,
  Switch,
  Flex,
  FlexItem,
  Card,
  CardBody,
} from '@patternfly/react-core';
import { cloneDeep, merge } from 'lodash';
import RepoSelector from './RepoSelector';
import { subscribeProductsWithReposAction } from '../../SCCProductPageActions';
import ProductTreeExpander from '../common/ProductTreeExpander';

const addCheckBoxToTree = (tree) => {
  const checkProps = {};
  checkProps.checked = tree.product_id !== null;
  checkProps.disabled = tree.product_id !== null;
  tree.checkProps = checkProps;

  return tree;
};

const addParentToTree = (tree, par) => {
  tree.parent = par;
  return tree;
};

const addRepoSelectorToTree = (
  tree,
  disableRepos,
  activateDebugFilter,
  setSelectedReposFromChild
) => {
  tree.customBadgeContent[0] = (
    <Tooltip content={__('Filter repositories')}>
      <RepoSelector
        sccRepos={tree.scc_repositories}
        disableRepos={tree.product_id === null && !tree.checkProps.checked}
        activateDebugFilter={activateDebugFilter}
        productAlreadySynced={tree.product_id !== null}
        sccProductId={tree.id}
        setSelectedReposFromChild={setSelectedReposFromChild}
      />{' '}
    </Tooltip>
  );
  return tree;
};

const setupTreeViewListItem = (
  tree,
  isRoot,
  activateDebugFilter,
  setSelectedReposFromChild
) => {
  tree.customBadgeContent = [];
  addCheckBoxToTree(tree);
  addRepoSelectorToTree(
    tree,
    tree.product_id === null,
    activateDebugFilter,
    setSelectedReposFromChild
  );
  if ('children' in tree) {
    tree.children = tree.children.map((p) =>
      setupTreeViewListItem(
        p,
        false,
        activateDebugFilter,
        setSelectedReposFromChild
      )
    );
    tree.children.map((child) => addParentToTree(child, tree));
  }
  return tree;
};

const checkAllParents = (
  tree,
  activateDebugFilter,
  setSelectedReposFromChild
) => {
  if (!tree.checkProps.checked) {
    tree.checkProps.checked = true;
    addRepoSelectorToTree(
      tree,
      false,
      activateDebugFilter,
      setSelectedReposFromChild
    );
  }
  if (tree.parent)
    checkAllParents(
      tree.parent,
      activateDebugFilter,
      setSelectedReposFromChild
    );

  return tree;
};

const uncheckAllChildren = (
  tree,
  activateDebugFilter,
  setSelectedReposFromChild
) => {
  if (tree.product_id === null) {
    tree.checkProps.checked = false;
    addRepoSelectorToTree(
      tree,
      true,
      activateDebugFilter,
      setSelectedReposFromChild
    );
  }
  if ('children' in tree)
    tree.children = tree.children.map((c) =>
      uncheckAllChildren(c, activateDebugFilter, setSelectedReposFromChild)
    );

  return tree;
};

const getRootParent = (tree) => {
  if (tree.parent) return getRootParent(tree.parent);

  return tree;
};

const TreeSelector = ({
  sccProducts,
  sccAccountId,
  resetFormFromParent,
  handleSubscribeCallback,
}) => {
  const dispatch = useDispatch();
  // this needs to be uninitialized such that the first call to setAllExpanded can actually
  // change the value of allExpanded
  const [expandAll, setExpandAll] = useState();
  const [selectedRepos, setSelectedRepos] = useState({});
  // the debug filter is actually a 'includeDebugRepos' setting which should not be active by default
  const [activateDebugFilter, setActivateDebugFilter] = useState(false);

  const setSelectedReposFromChild = (sccProductId, repoArray) => {
    if (repoArray.length !== 0) {
      // do not use setSelectedRepos method, as we do not want to trigger a re-render
      selectedRepos[sccProductId] = repoArray;
    } else if (selectedRepos !== {} && sccProductId in selectedRepos) {
      delete selectedRepos[sccProductId];
    }
  };

  const [sccProductTree, setSccProductTree] = useState(
    cloneDeep(sccProducts).map((p) =>
      setupTreeViewListItem(
        p,
        true,
        activateDebugFilter,
        setSelectedReposFromChild
      )
    )
  );

  useEffect(() => {
    setSccProductTree(
      cloneDeep(sccProducts).map((p) =>
        setupTreeViewListItem(
          p,
          true,
          activateDebugFilter,
          setSelectedReposFromChild
        )
      )
    );
  }, [sccProducts]);

  const setExpandAllFromChild = (expandAllFromChild) => {
    setExpandAll(expandAllFromChild);
  };

  const debugFilterChange = (evt) => {
    setActivateDebugFilter(!activateDebugFilter);
  };

  const onCheck = (evt, treeViewItem) => {
    if (evt.target.checked) {
      checkAllParents(
        treeViewItem,
        activateDebugFilter,
        setSelectedReposFromChild
      );
    } else {
      uncheckAllChildren(
        treeViewItem,
        activateDebugFilter,
        setSelectedReposFromChild
      );
    }

    setSccProductTree([...merge(sccProductTree, getRootParent(treeViewItem))]);
  };

  const submitForm = (evt) => {
    const productsToSubscribe = [];
    Object.keys(selectedRepos).forEach((k) => {
      const repo = {
        scc_product_id: parseInt(k, 10),
        repository_list: selectedRepos[k],
      };
      productsToSubscribe.push(repo);
    });
    dispatch(
      subscribeProductsWithReposAction(
        sccAccountId,
        productsToSubscribe,
        handleSubscribeCallback
      )
    );
    // reset data structure and form
    setSelectedRepos({});
    resetFormFromParent();
  };

  return (
    <Card>
      <CardBody>
        <Flex direction={{ default: 'column' }}>
          <Flex>
            <ProductTreeExpander setExpandAllInParent={setExpandAllFromChild} />
            <FlexItem>
              <Tooltip
                content={__(
                  'If this option is enabled, debug and source pool repositories are automatically selected if you select a product. This option is disabled by default. It applies for unselected products, only. Already selected products are not filtered.'
                )}
              >
                <Switch
                  id="filter-debug-switch"
                  onChange={debugFilterChange}
                  isChecked={activateDebugFilter}
                  label={__('Include Debug and Source Pool repositories')}
                />
              </Tooltip>
            </FlexItem>
          </Flex>
          <Flex>
            <TreeView
              data={sccProductTree}
              allExpanded={expandAll}
              onCheck={onCheck}
              hasChecks
              hasBadges
              hasGuides
            />
          </Flex>
          <Flex>
            <Button variant="primary" onClick={submitForm}>
              {__('Add product(s)')}
            </Button>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

TreeSelector.propTypes = {
  sccProducts: PropTypes.array,
  sccAccountId: PropTypes.number.isRequired,
  resetFormFromParent: PropTypes.func.isRequired,
  handleSubscribeCallback: PropTypes.func.isRequired,
};

TreeSelector.defaultProps = {
  sccProducts: [],
};

export default TreeSelector;
