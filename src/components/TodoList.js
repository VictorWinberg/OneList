import React from 'react';
import { List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Todo from './Todo';

const TodoList = ({ todos, onTodoClick }) => (
  <List relaxed>
    { todos.map(todo => (
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    ))}
  </List>
);

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool,
  })).isRequired,
  onTodoClick: PropTypes.func.isRequired,
};

export default TodoList;
