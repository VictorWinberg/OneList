import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import penselecticon from '../assets/icons/pen-select.svg';

const ListItem = ({ id, text, completed, onClick, linkTo }) => (
  <li className="listitem">
    <label
      role="presentation"
      onClick={onClick}
      onKeyDown={onClick}
      htmlFor={id}
    >
      <input readOnly type="checkbox" id={id} checked={completed} />
      {text}
      <span className="checkmark" />
    </label>
    <Link to={linkTo}>
      <img id="editicon" src={penselecticon} alt="Edit" height="20px" />
    </Link>
  </li>
);

ListItem.defaultProps = {
  completed: false,
};

ListItem.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  linkTo: PropTypes.string.isRequired,
};

export default ListItem;
