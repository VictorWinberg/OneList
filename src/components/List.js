import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

const li = (item, onItemClick, linkTo) => (
  <ListItem
    key={item.id}
    {...item}
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
}) => (
  <div>
    <ul className="shoppingList">
      {items.map(item => li(item, onItemClick, linkTo))}
    </ul>
    <ul className={checked.length ? 'done' : 'hidden'}>
      <h2>{translate('products.cart')}</h2>
      <button className="removeBtn" onClick={onRemoveItems}>
        {translate('products.remove')}
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
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool,
    })
  ).isRequired,
  checked: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool,
    })
  ),
  onItemClick: PropTypes.func.isRequired,
  onRemoveItems: PropTypes.func.isRequired,
  linkTo: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};

export default List;
