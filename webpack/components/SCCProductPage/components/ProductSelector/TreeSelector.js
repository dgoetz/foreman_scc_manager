import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { TreeView, Button, Tooltip } from '@patternfly/react-core';
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

const addRepoSelectorToTree = (tree, disableRepos, selectAll) => {
  tree.customBadgeContent[0] = (
    <Tooltip content={__('Filter repositories')}>
      <RepoSelector
        sccRepos={tree.scc_repositories}
        disableRepos={ tree.product_id === null && !tree.checkProps.checked }
        selectAll={selectAll}
      />{' '}
    </Tooltip>
  );
  return tree;
};

const setupTreeViewListItem = (tree, isRoot) => {
  tree.customBadgeContent = [];
  addCheckBoxToTree(tree);
  addRepoSelectorToTree(tree, tree.product_id === null);
  if ('children' in tree) {
    tree.children = tree.children.map(setupTreeViewListItem, false);
    tree.children.map((child) => addParentToTree(child, tree));
  }
  return tree;
};

const toggleRepoSelection = (tree, disableRepos) => {
  addRepoSelectorToTree(tree, disableRepos, tree.checkProps.checked);

  if (disableRepos){
    if ('children' in tree) tree.children.map((p) => toggleRepoSelection(p, disableRepos))
  } else {
    if (tree.parent) toggleRepoSelection(tree.parent, disableRepos);
  }

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

const checkAllRepos = (tree) => {
  if (tree.checkProps.checked || tree.product_id !== null) {
    tree.customBadgeContent = [];
    addRepoSelectorToTree(tree, false, true);

    if ('children' in tree) {
      tree.children = tree.children.map(checkAllRepos);
    }
  }

  return tree;
};

const TreeSelector = ({ sccProducts, subscribeProducts }) => {
  const [sccProductTree, setSccProductTree] = useState(
    cloneDeep(sccProducts).map(setupTreeViewListItem)
  );
  const [allExpanded, setAllExpanded] = useState();

  const collapseAll = (evt) => {
    setAllExpanded(false);
  };

  const expandAll = (evt) => {
    setAllExpanded(true);
  };

  const selectAllRepos = (evt) => {
    const checkedRepoProducts = cloneDeep(sccProductTree).map((p) =>
      checkAllRepos(p)
    );
    setSccProductTree(checkedRepoProducts);
  };

  const onCheck = (evt, treeViewItem) => {
    if (evt.target.checked) {
      checkAllParents(treeViewItem);
    } else {
      uncheckAllChildren(treeViewItem);
    }

    toggleRepoSelection(treeViewItem, !evt.target.checked);

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
