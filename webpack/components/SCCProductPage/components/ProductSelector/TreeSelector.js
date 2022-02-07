import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { TreeView, Button, Tooltip, Switch } from '@patternfly/react-core';
import { cloneDeep, merge, flatten, flattenDeep } from 'lodash';
import RepoSelector from './RepoSelector';

const getCheckedElements = (tree) => {
  let ids = [];
  if (tree.checkProps.checked && tree.product_id === null) {
    ids.push(tree.id);
  }
  if ('children' in tree) {
    ids = ids.concat(
      flattenDeep(tree.children.map((c) => getCheckedElements(c)))
    );
  }
  return ids;
};

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

const addRepoSelectorToTree = (tree, disableRepos, activateDebugFilter) => {
  tree.customBadgeContent[0] = (
    <Tooltip content={__('Filter repositories')}>
      <RepoSelector
        sccRepos={tree.scc_repositories}
        disableRepos={tree.product_id === null && !tree.checkProps.checked}
        activateDebugFilter={activateDebugFilter}
        productAlreadySynced={tree.product_id !== null}
      />{' '}
    </Tooltip>
  );
  return tree;
};

const setupTreeViewListItem = (tree, isRoot, activateDebugFilter) => {
  tree.customBadgeContent = [];
  addCheckBoxToTree(tree);
  addRepoSelectorToTree(tree, tree.product_id === null, activateDebugFilter);
  if ('children' in tree) {
    tree.children = tree.children.map(
      setupTreeViewListItem,
      false,
      activateDebugFilter
    );
    tree.children.map((child) => addParentToTree(child, tree));
  }
  return tree;
};

const toggleRepoSelection = (tree, disableRepos, activateDebugFilter) => {
  addRepoSelectorToTree(tree, disableRepos, activateDebugFilter);

  if (disableRepos) {
    if ('children' in tree)
      tree.children.map((p) =>
        toggleRepoSelection(p, disableRepos, activateDebugFilter)
      );
  } else if (tree.parent)
    toggleRepoSelection(tree.parent, disableRepos, activateDebugFilter);

  return tree;
};

const checkAllParents = (tree) => {
  tree.checkProps.checked = true;
  if (tree.parent) checkAllParents(tree.parent);

  return tree;
};

const getRootParent = (tree) => {
  if (tree.parent) return getRootParent(tree.parent);

  return tree;
};

const uncheckAllChildren = (tree) => {
  if (tree.product_id === null) tree.checkProps.checked = false;
  if ('children' in tree) tree.children = tree.children.map(uncheckAllChildren);

  return tree;
};

const TreeSelector = ({ sccProducts, subscribeProducts }) => {
  const [activateDebugFilter, setActivateDebugFilter] = useState(true);
  const [sccProductTree, setSccProductTree] = useState(
    cloneDeep(sccProducts).map((p) =>
      setupTreeViewListItem(p, true, activateDebugFilter)
    )
  );
  const [allExpanded, setAllExpanded] = useState();

  const collapseAll = (evt) => {
    setAllExpanded(false);
  };

  useEffect(() => {
    setSccProductTree(
      cloneDeep(sccProducts).map((p) =>
        setupTreeViewListItem(p, true, activateDebugFilter)
      )
    );
  }, [sccProducts]);

  const expandAll = (evt) => {
    setAllExpanded(true);
  };

  const debugFilterChange = (evt) => {
    setActivateDebugFilter(!activateDebugFilter);

    sccProductTree.map((p) =>
      toggleRepoSelection(
        p,
        p.checkProps.checked || p.product_id !== null,
        !activateDebugFilter
      )
    );
  };

  const onCheck = (evt, treeViewItem) => {
    if (evt.target.checked) {
      checkAllParents(treeViewItem);
    } else {
      uncheckAllChildren(treeViewItem);
    }

    toggleRepoSelection(treeViewItem, !evt.target.checked, activateDebugFilter);

    setSccProductTree([...merge(sccProductTree, getRootParent(treeViewItem))]);
  };

  const submitForm = (evt) => {
    const productsToSubscribe = flatten(
      sccProductTree
        .filter((p) => p.checkProps.checked)
        .map((p) => getCheckedElements(p))
    );
    subscribeProducts(productsToSubscribe);
  };

  return (
    <>
      <Flex direction={{ default: 'column' }}>
        <Flex>
          <Flex>
            <FlexItem>
              <Tile
                isSelected={allExpanded === undefined ? false : !allExpanded}
              >
                <Button variant="link" onClick={collapseAll}>
                  {__('Collapse all')}
                </Button>
              </Tile>
            </FlexItem>
            <FlexItem>
              <Tile
                isSelected={allExpanded === undefined ? false : allExpanded}
              >
                <Button variant="link" onClick={expandAll}>
                  {__('Expand all')}
                </Button>
              </Tile>
            </FlexItem>
          </Flex>
          <Flex
            alignContent={{ default: 'alignContentSpaceAround' }}
            alignSelf={{ default: 'alignSelfCenter' }}
          >
            <FlexItem>
              <Switch
                id="filter-debug-switch"
                onChange={debugFilterChange}
                isChecked={activateDebugFilter}
                label={__('Filter Debug and Source Pool packages')}
              />
            </FlexItem>
          </Flex>
        </Flex>
        <Flex>
          <TreeView
            data={sccProductTree}
            allExpanded={allExpanded}
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
    </>
  );
};

TreeSelector.propTypes = {
  sccProducts: PropTypes.array,
  subscribeProducts: PropTypes.func,
};

TreeSelector.defaultProps = {
  sccProducts: [],
};

export default TreeSelector;
