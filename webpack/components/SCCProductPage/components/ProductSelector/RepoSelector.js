import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import {
  Tooltip,
  Icon,
  Select,
  SelectOption,
  SelectGroup,
  SelectVariant,
} from '@patternfly/react-core';
import { merge } from 'lodash';

const createRepoSelectOption = (repo, disableRepos) => (
  <SelectOption
    key={repo.id}
    isDisabled={repo.katello_root_repository_id !== null || disableRepos}
    value={repo.name}
  />
);

const setRepoSelection = (
  sccRepos,
  disableRepos,
  activateDebugFilter,
  productAlreadySynced
) => {
  let res = [];
  if (!disableRepos && !productAlreadySynced) {
    if (activateDebugFilter) {
      res = sccRepos.filter(
        (repo) =>
          (!repo.name.includes('Debug') &&
            !repo.name.includes('Source-Pool') &&
            repo.katello_root_repository_id === null) ||
          repo.katello_root_repository_id !== null
      );
    } else {
      res = sccRepos;
    }
  } else {
    res = sccRepos.filter((repo) => repo.katello_root_repository_id !== null);
  }
  return res.map((repo) => repo.name);
};

// disableRepos makes sure that repos can only be selected if the corresponding product
// is also selected
const RepoSelector = ({
  sccRepos,
  disableRepos,
  activateDebugFilter,
  productAlreadySynced,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // set initial selected values to the already checked repos
  const [selected, setSelected] = useState(
    setRepoSelection(
      sccRepos,
      disableRepos,
      activateDebugFilter,
      productAlreadySynced
    )
  );
  const [placeHolder, setPlaceHolder] = useState();
  const onToggle = (toggle) => {
    setIsOpen(toggle);
  };

  useEffect(() => {
    setSelected(
      setRepoSelection(
        sccRepos,
        disableRepos,
        activateDebugFilter,
        productAlreadySynced
      )
    );
  }, [disableRepos, activateDebugFilter]);

  const onSelect = (event, selection) => {
    let sel = [];
    if (event.target.checked) {
      sel = [...new Set(selected.concat([selection]))];
    } else {
      sel = selected.filter((item) => item !== selection);
    }

    setSelected(sel);
  };

  const selectOptions = sccRepos.map((repo) =>
    createRepoSelectOption(repo, disableRepos)
  );

  return (
    <Select
      variant={SelectVariant.checkbox}
      isCheckboxSelectionBadgeHidden
      onToggle={onToggle}
      onSelect={onSelect}
      selections={selected}
      isOpen={isOpen}
      isDisabled={disableRepos}
      placeholderText={sprintf(__('%s/%s'), selected.length, sccRepos.length)}
    >
      {selectOptions}
    </Select>
  );
};

RepoSelector.propTypes = {
  sccRepos: PropTypes.array,
  disableRepos: PropTypes.bool,
  activateDebugFilter: PropTypes.bool,
  productAlreadySynced: PropTypes.bool,
};

RepoSelector.defaultProps = {
  sccRepos: [],
  disableRepos: false,
  activateDebugFilter: false,
  productAlreadySynced: false,
};

export default RepoSelector;
