import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, BadgeToggle } from '@patternfly/react-core';
import {
  OutlinedCircleIcon,
  OutlinedCheckCircleIcon,
  ExclamationCircleIcon,
  FolderOpenIcon,
} from '@patternfly/react-icons';
import { BrowserRouter, Link } from 'react-router-dom';
import { foremanUrl } from 'foremanReact/common/helpers';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';

const createKatelloRepoLink = (repo, sccProductId) => {
  const url = foremanUrl(
    `/products/${sccProductId}/repositories/${repo.katello_root_repository_id}`
  );
  return (
    <Tooltip content={__('Go to Repository page')}>
      <BrowserRouter>
        <Link to={url}>{repo.name}</Link>
      </BrowserRouter>
    </Tooltip>
  );
};

const createRepoDropDownItem = (repo, sccProductId) => (
  <DropdownItem
    key={repo.id}
    component="button"
    icon={
      repo.subscription_valid ? (
        repo.katello_root_repository_id !== null ? (
          <Icon name="check" type="fa" />
        ) : (
          <Tooltip content={__('Repository not imported')}>
            <Icon name="ban" type="fa" />
          </Tooltip>
        )
      ) : (
        <OutlinedCircleIcon />
      )
    }
  >
    {repo.katello_root_repository_id !== null
      ? createKatelloRepoLink(repo, sccProductId)
      : repo.name}
  </DropdownItem>
);

const SCCRepoView = ({ sccRepos, sccProductId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = (isOpen) => {
    setIsOpen(isOpen);
  };

  const onFocus = () => {
    const element = document.getElementById('toggle-id');
    element.focus();
  };

  const onSelect = (event) => {
    setIsOpen(!isOpen);
    onFocus();
  };

  const dropdownItems = sccRepos.map((repo) =>
    createRepoDropDownItem(repo, sccProductId)
  );

  return (
    <Dropdown
      onSelect={onSelect}
      toggle={
        <BadgeToggle id="toggle-id" onToggle={onToggle}>
          {sprintf(
            __('Show repositories (%s/%s)'),
            sccRepos.filter((r) => r.katello_root_repository_id !== null)
              .length,
            sccRepos.length
          )}
        </BadgeToggle>
      }
      isOpen={isOpen}
      dropdownItems={dropdownItems}
    />
  );
};

SCCRepoView.propTypes = {
  sccRepos: PropTypes.array,
  sccProductId: PropTypes.number,
};

SCCRepoView.defaultProps = {
  sccRepos: undefined,
  sccProductId: undefined,
};

export default SCCRepoView;
