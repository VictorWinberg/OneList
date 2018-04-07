import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

const List = ({ items, checked, onItemClick, onRemoveItems, translate }) => (
  <div>
    <ul className="shoppingList">
      {items.map(item => (
        <ListItem
          key={item.id}
          {...item}
          onClick={() => onItemClick(item.id)}
        />
      ))}
    </ul>
    <ul className={checked.length ? 'done' : 'hidden'}>
      <h2>{translate('shoppinglist.cart')}</h2>
      <button className="removeDone" onClick={onRemoveItems}>
        {translate('shoppinglist.remove')}
      </button>
      {checked.map(item => (
        <ListItem
          key={item.id}
          {...item}
          onClick={() => onItemClick(item.id)}
        />
      ))}
    </ul>
  </div>
);

List.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool,
    })
  ).isRequired,
  checked: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool,
    })
  ).isRequired,
  onItemClick: PropTypes.func.isRequired,
  onRemoveItems: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};

export default List;
