import React from 'react';
// import PropTypes from 'prop-types';

import TodoList from './TodoList';
import NewTodo from './NewTodo';

const Categories = () => (
  <div>
    <NewTodo />
    <TodoList />
  </div>
);

export default Categories;