import React from 'react';
import PropTypes from 'prop-types';

const Todo = ({ text, completed, onClick }) => (
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
  </li>
);

Todo.defaultProps = {
  completed: false,
};

Todo.propTypes = {
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default Todo;
