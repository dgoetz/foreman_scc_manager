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

const setInitialRepoSelection = (sccRepos, disableRepos, selectAll) => {
  let res = [];
  if (selectAll && !disableRepos) {
    res = sccRepos.filter((repo) => repo.id === repo.id).map((repo) => repo.name);
  } else {
    res = sccRepos
      .filter((repo) => repo.katello_root_repository_id !== null)
      .map((repo) => repo.name);
  }
  return res;
};

// disableRepos makes sure that repos can only be selected if the corresponding product
// is also selected
const RepoSelector = ({ sccRepos, disableRepos, selectAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  // set initial selected values to the already checked repos
  const [selected, setSelected] = useState(
    setInitialRepoSelection(sccRepos, disableRepos, selectAll)
  );
  const [placeHolder, setPlaceHolder] = useState();
  const onToggle = (toggle) => {
    setIsOpen(toggle);
  };

  useEffect (() => {
    setSelected(setInitialRepoSelection(sccRepos, disableRepos, selectAll));
  }, [disableRepos]);

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
      placeholderText={sprintf(
          __('%s/%s'),
          selected.length,
          sccRepos.length
        )}>
      {selectOptions}
    </Select>
  );
};

RepoSelector.propTypes = {
  sccRepos: PropTypes.array,
  disableRepos: PropTypes.bool,
  selectAll: PropTypes.bool,
};

RepoSelector.defaultProps = {
  sccRepos: [],
  disableRepos: false,
  selectAll: false,
};

export default RepoSelector;
