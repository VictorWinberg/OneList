import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

const li = (item, onItemClick, linkTo) => (
  <ListItem
    key={item.id}
    id={item.id}
    value={item.value}
    checked={item.checked}
    onClick={() => onItemClick(item.id)}
    linkTo={linkTo(item.id)}
  />
);

const List = ({
  items,
  checked,
  onItemClick,
  onRemoveItems,
  linkTo,
  translate,
  view,
}) => (
  <div className={view}>
    <ul className="active">
      {items.map(item => li(item, onItemClick, linkTo))}
    </ul>
    <ul className={checked.length ? 'done' : 'hidden'}>
      <h2>{translate(`${view}.cart`)}</h2>
      <button className="removeBtn" onClick={onRemoveItems}>
        {translate(`${view}.remove`)}
      </button>
      {checked.map(item => li(item, onItemClick, linkTo))}
    </ul>
  </div>
);

List.defaultProps = {
  checked: [],
};

List.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      checked: PropTypes.bool,
    })
  ).isRequired,
  checked: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      checked: PropTypes.bool,
    })
  ),
  onItemClick: PropTypes.func.isRequired,
  onRemoveItems: PropTypes.func.isRequired,
  linkTo: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
};

export default List;
