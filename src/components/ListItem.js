import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import penselecticon from '../assets/icons/pen-select.svg';

const ListItem = ({ id, value, description, checked, days, italic, onClick, linkTo, backUrl }) => (
  <li className="listitem">
    <label
      role="presentation"
      onKeyDown={onClick}
      htmlFor={id}
      className={italic ? 'text-italic' : ''}
    >
      <input readOnly id={id} type="checkbox" onClick={onClick} checked={checked} />
      <span className="productText">{value}</span>
      {description}
      <span className="productDays">{daysToHumanReadable(days)}</span>
      <span className="checkmark" />
    </label>
    <Link to={{ pathname: linkTo, query: { backUrl } }}>
      <img id="editicon" src={penselecticon} alt="Edit" height="27px" />
    </Link>
  </li>
);

const daysToHumanReadable = (days) => {
  if (days == null) return null;

  const years = parseFloat((days / 365).toFixed(1));
  if (years >= 1) return `${years}y`;

  const months = Math.floor(days / 30);
  if (months >= 1) return `${months}m`;

  return `${days}d`;
};

ListItem.defaultProps = {
  checked: false,
  onClick: null,
  description: null,
  days: null,
  backUrl: null,
  italic: false,
};

ListItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.element,
  checked: PropTypes.bool,
  days: PropTypes.number,
  italic: PropTypes.bool,
  onClick: PropTypes.func,
  linkTo: PropTypes.string.isRequired,
  backUrl: PropTypes.string,
};

export default ListItem;
