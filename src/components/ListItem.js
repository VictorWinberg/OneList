import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import penselecticon from '../assets/icons/pen-select.svg';

const ListItem = ({ id, value, checked, onClick, linkTo }) => (
  <li className="listitem">
    <label role="presentation" onKeyDown={onClick} htmlFor={id}>
      <input
        readOnly
        id={id}
        type="checkbox"
        onClick={onClick}
        checked={checked}
      />
      <span className="productText">{value}</span>
      {value && <span><span className="amountText">100 gram</span>
        <span className="checkmark" /> </span>}
    </label>
    <Link to={linkTo}>
      <img id="editicon" src={penselecticon} alt="Edit" height="27px" />
    </Link>
  </li>
);

ListItem.defaultProps = {
  checked: false,
  onClick: null,
};

ListItem.propTypes = {
  id: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onClick: PropTypes.func,
  linkTo: PropTypes.string.isRequired,
};

export default ListItem;
