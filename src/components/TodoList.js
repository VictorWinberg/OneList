import React from 'react';
import PropTypes from 'prop-types';

import Todo from './Todo';
// import Button from './Button'

const TodoList = ({ todos, doneTodos, onTodoClick, translate }) => (
  <div>
    <ul className="shoppingList">
      {todos.map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
      ))}
    </ul>
    <ul className={doneTodos.length ? 'done' : 'hidden'}>
      <h2>{translate('shoppinglist.cart')}</h2>
      <button className="removeDone">{translate('shoppinglist.remove')}</button>
      {doneTodos.map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
      ))}
    </ul>
  </div>
);

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool,
    })
  ).isRequired,
  doneTodos: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool,
    })
  ).isRequired,
  onTodoClick: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};

export default TodoList;
