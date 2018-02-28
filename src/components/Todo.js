import React from 'react';
import { List, Checkbox } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Todo = ({ text, completed, onClick }) => (
  <List.Item>
    <Checkbox label={text} checked={completed} onClick={onClick} />
  </List.Item>
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
