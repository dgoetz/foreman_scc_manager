import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { TreeView, Button, Tooltip, Switch } from '@patternfly/react-core';
import { cloneDeep, merge } from 'lodash';
import RepoSelector from './RepoSelector';
import { subscribeProductsWithReposAction } from '../../SCCProductPageActions';

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

const toggleRepoSelection = (
  tree,
  disableRepos,
  activateDebugFilter,
  setSelectedReposFromChild
) => {
  addRepoSelectorToTree(
    tree,
    disableRepos,
    activateDebugFilter,
    setSelectedReposFromChild
  );

  if (disableRepos) {
    if ('children' in tree)
      tree.children.map((p) =>
        toggleRepoSelection(
          p,
          disableRepos,
          activateDebugFilter,
          setSelectedReposFromChild
        )
      );
  } else if (tree.parent)
    toggleRepoSelection(
      tree.parent,
      disableRepos,
      activateDebugFilter,
      setSelectedReposFromChild
    );

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

const TreeSelector = ({ sccProducts, sccAccountId }) => {
  const dispatch = useDispatch();
  // this needs to be uninitialized such that the first call to setAllExpanded can actually
  // change the value of allExpanded
  const [allExpanded, setAllExpanded] = useState();
  const [selectedRepos, setSelectedRepos] = useState({});
  const [activateDebugFilter, setActivateDebugFilter] = useState(true);

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
  }, [sccProducts, activateDebugFilter]);

  const collapseAll = (evt) => {
    setAllExpanded(false);
  };

  const expandAll = (evt) => {
    setAllExpanded(true);
  };

  const debugFilterChange = (evt) => {
    setActivateDebugFilter(!activateDebugFilter);

    sccProductTree.map((p) =>
      toggleRepoSelection(
        p,
        p.checkProps.checked || p.product_id !== null,
        !activateDebugFilter,
        setSelectedReposFromChild
      )
    );
  };

  const onCheck = (evt, treeViewItem) => {
    if (evt.target.checked) {
      checkAllParents(treeViewItem);
    } else {
      uncheckAllChildren(treeViewItem);
    }

    toggleRepoSelection(
      treeViewItem,
      !evt.target.checked,
      activateDebugFilter,
      setSelectedReposFromChild
    );

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
      subscribeProductsWithReposAction(sccAccountId, productsToSubscribe)
    );
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
  sccAccountId: PropTypes.number.isRequired,
};

TreeSelector.defaultProps = {
  sccProducts: [],
};

export default TreeSelector;
