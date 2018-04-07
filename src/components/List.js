import React from 'react';
import PropTypes from 'prop-types';

import Todo from './Todo';

const List = ({
  todos,
  doneTodos,
  onTodoClick,
  onRemoveProducts,
  translate,
}) => (
  <div>
    <ul className="shoppingList">
      {todos.map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
      ))}
    </ul>
    <ul className={doneTodos.length ? 'done' : 'hidden'}>
      <h2>{translate('shoppinglist.cart')}</h2>
      <button className="removeDone" onClick={onRemoveProducts}>
        {translate('shoppinglist.remove')}
      </button>
      {doneTodos.map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
      ))}
    </ul>
  </div>
);

List.propTypes = {
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
  onRemoveProducts: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
};

export default List;
