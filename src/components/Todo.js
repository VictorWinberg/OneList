import React from 'react';
import PropTypes from 'prop-types';

const Todo = ({ text, completed, onClick }) => (
  <li>
    <input type="checkbox" value={text} checked={completed} onClick={onClick} />
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
