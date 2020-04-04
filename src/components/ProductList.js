import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

const showAmount = (amount, unit) => {
  if (amount !== '0') {
    return <span className="amountText">{amount.replace(/\./, ',')}{unit}</span>
  }
  return null;
}

const li = (item, onItemClick, linkTo) => (
  <ListItem
    key={item.id}
    id={item.id}
    value={item.value}
    description={showAmount(item.amount, item.unit)}
    checked={item.checked}
    onClick={() => onItemClick(item.id)}
    linkTo={linkTo(item.id)}
  />
);

const ProductList = ({
  active,
  checked,
  onItemClick,
  onDoneClick,
  linkTo,
  translate,
  view,
}) => (
    <div className={view}>
      <div>
        {active.map(({ value, color, items }) => (
          <div key={value} style={{ borderLeft: `5px solid ${color || '#ccc'}` }}>
            <div className="section">{value}</div>
            <ul className="active">
              {items.map(item => li(item, onItemClick, linkTo))}
            </ul>
          </div>
        ))}
      </div>
      <ul className={checked.length ? 'done' : 'hidden'}>
        <h2>{translate(`${view}.cart`)}</h2>
        <button className="removeBtn" onClick={onDoneClick}>
          {translate(`${view}.remove`)}
        </button>
        <ul>{checked.map(item => li(item, onItemClick, linkTo))}</ul>
      </ul>
    </div>
  );

ProductList.propTypes = {
  active: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      color: PropTypes.string,
      items: PropTypes.array,
    })
  ).isRequired,
  checked: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      items: PropTypes.array,
    })
  ).isRequired,
  onItemClick: PropTypes.func.isRequired,
  onDoneClick: PropTypes.func.isRequired,
  linkTo: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
};

export default ProductList;
