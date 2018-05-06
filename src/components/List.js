import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

const List = ({ items, onItemClick, linkTo, view }) => (
  <div className={view}>
    <ul>
      {items.map(({ id, value, checked }) => (
        <ListItem
          key={id}
          id={id}
          value={value}
          checked={checked}
          onClick={() => onItemClick(id)}
          linkTo={linkTo(id)}
        />
      ))}
    </ul>
  </div>
);

List.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      checked: PropTypes.bool,
    })
  ).isRequired,
  onItemClick: PropTypes.func.isRequired,
  linkTo: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
};

export default List;
