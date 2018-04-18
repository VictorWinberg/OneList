import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ListItem = ({ id, text, completed, onClick }) => (
  <li>
    <label
      role="presentation"
      onClick={onClick}
      onKeyDown={onClick}
      htmlFor={id}
    >
      <input type="checkbox" id={id} checked={completed} />
      {text}
    </label>
    <Link to="/">
      <img id="editicon" src="/icons/edit_icon.png" alt="Edit" height="20px" />
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
};

export default ListItem;
