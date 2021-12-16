import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { TreeView, Button, Badge } from '@patternfly/react-core';
import { cloneDeep, merge } from 'lodash';

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

const setupTreeViewListItem = (tree, isRoot) => {
  addCheckBoxToTree(tree);
  addCheckBoxToTree(tree);
  if ('children' in tree) {
    tree.children = tree.children.map(setupTreeViewListItem, false);
    tree.children.map((child) => addParentToTree(child, tree));
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

const TreeSelector = ({ sccProducts }) => {
  const [sccProductTree, setSccProductTree] = useState(
    cloneDeep(sccProducts).map(setupTreeViewListItem)
  );
  const [allExpanded, setAllExpanded] = useState();

  const collapseAll = (evt) => {
    setAllExpanded(false);
  };

  useEffect(() => {
    setSccProductTree(cloneDeep(sccProducts).map(setupTreeViewListItem));
  }, [sccProducts]);

  const expandAll = (evt) => {
    setAllExpanded(true);
  };

  const onCheck = (evt, treeViewItem) => {
    if (evt.target.checked) checkAllParents(treeViewItem);
    else uncheckAllChildren(treeViewItem);

    setSccProductTree([...merge(sccProductTree, getRootParent(treeViewItem))]);
  };

  const submitForm = (evt) => {};

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
};

TreeSelector.defaultProps = {
  sccProducts: [],
};

export default TreeSelector;
