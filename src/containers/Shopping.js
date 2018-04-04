import React from 'react';
// import PropTypes from 'prop-types';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/filter';

import TodoList from './TodoList';
import Filter from './Filter';
import NewTodo from './NewTodo';

const Shopping = () => (
  <div>
    <NewTodo />
    <Filter filter={SHOW_ALL} />
    <Filter filter={SHOW_COMPLETED} />
    <Filter filter={SHOW_ACTIVE} />
    <TodoList />
  </div>
);

export default Shopping;
