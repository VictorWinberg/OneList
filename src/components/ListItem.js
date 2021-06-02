import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import penselecticon from '../assets/icons/pen-select.svg';

const ListItem = ({ id, value, description, checked, italic, onClick, linkTo, backUrl }) => (
  <li className="listitem">
    <label role="presentation" onKeyDown={onClick} htmlFor={id} className={italic ? 'text-italic' : ''}>
      <input
        readOnly
        id={id}
        type="checkbox"
        onClick={onClick}
        checked={checked}
      />
      <span className="productText">{value}</span>
      {description}
      <span className="checkmark" />
    </label>
    <Link to={{ pathname: linkTo, query: { backUrl } }}>
      <img id="editicon" src={penselecticon} alt="Edit" height="27px" />
    </Link>
  </li>
);

ListItem.defaultProps = {
  checked: false,
  onClick: null,
  description: null,
  backUrl: null,
  italic: false,
};

ListItem.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.element,
  checked: PropTypes.bool,
  italic: PropTypes.bool,
  onClick: PropTypes.func,
  linkTo: PropTypes.string.isRequired,
  backUrl: PropTypes.string,
};

export default ListItem;
