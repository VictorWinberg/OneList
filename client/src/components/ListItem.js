import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import penselecticon from '../assets/icons/pen-select.svg';

const daysToHumanReadable = (days) => {
  if (days == null) return null;

  const years = Math.floor(days / 365);
  if (years >= 1) return `${years}y`;

  const months = Math.floor(days / 30);
  if (months >= 1) return `${months}m`;

  return `${days}d`;
};

const ListItem = ({
  id,
  value,
  description = null,
  checked = false,
  days = null,
  italic = false,
  onClick = null,
  linkTo,
  backUrl = null,
  onDelete,
}) => (
  <li className="listitem">
    <label
      role="presentation"
      onKeyDown={onClick}
      htmlFor={id}
      className={italic ? 'text-italic' : ''}
    >
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
    <div className="listitem-actions">
      <span className="productDays">{daysToHumanReadable(days)}</span>
      <Link to={{ pathname: linkTo, query: { backUrl } }}>
        <img id="editicon" src={penselecticon} alt="Edit" height="27px" />
      </Link>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="delete-button"
          aria-label="Delete"
        >
          ×
        </button>
      )}
    </div>
  </li>
);

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
  onDelete: PropTypes.func,
};

export default ListItem;
