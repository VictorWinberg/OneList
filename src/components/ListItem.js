import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ListItem = ({ text, completed, onClick }) => (
  <li>
    <label htmlFor="checkbox_id">
      <input
        type="checkbox"
        id="checkbox_id"
        checked={completed}
        onChange={onClick}
      />
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
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default ListItem;
