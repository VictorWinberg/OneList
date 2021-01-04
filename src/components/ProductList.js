import React from 'react';
import PropTypes from 'prop-types';

import ListItem from './ListItem';

const showAmount = (amount, unit) => {
  if (amount && amount !== '0') {
    return <span className="amountText">{amount.replace(/\./, ',')}{unit}</span>
  }
  return null;
}

const li = (item, onItemClick, linkTo, uid, backUrl) => (
  <ListItem
    key={item.key}
    id={item.id}
    value={item.value}
    description={showAmount('uid ', item.uid)}
    // description={showAmount(item.amount, item.unit)}
    checked={item.checked}
    onClick={() => onItemClick(item, uid !== null ? uid : item.uid)}
    linkTo={linkTo(item.id)}
    backUrl={backUrl}
  />
);

const ProductList = ({
  active,
  checked,
  onItemClick,
  onDoneClick,
  linkTo,
  backUrl,
  translate,
  view,
  uid,
}) => (
    <div className={view}>
      <div>
        {active.map(({ value, color, items }) => (
          <div key={value} style={{ borderLeft: `5px solid ${color || '#ccc'}` }}>
            <div className="section">{value}</div>
            <ul className="active">
              {items.map(item => li(item, onItemClick, linkTo, uid, backUrl))}
            </ul>
          </div>
        ))}
      </div>
      <ul className={checked.length ? 'done' : 'hidden'}>
        <h2>{translate(`${view}.cart`)}</h2>
        <button type="button" className="removeBtn" onClick={onDoneClick}>
          {translate(`${view}.remove`)}
        </button>
        <ul>{checked.map(item => li(item, onItemClick, linkTo))}</ul>
      </ul>
    </div>
  );

ProductList.defaultProps = {
  uid: null,
};

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
  backUrl: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  uid: PropTypes.number,
};

export default ProductList;
