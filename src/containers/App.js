import React from 'react';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/filter';

import TodoList from './TodoList';
import Filter from './Filter';
import NewTodo from './NewTodo';
import Header from '../components/Header';

const App = () => (
  <div>
    <Header />
    <NewTodo />
    <Filter filter={SHOW_ALL} />
    <Filter filter={SHOW_COMPLETED} />
    <Filter filter={SHOW_ACTIVE} />
    <TodoList />
  </div>
);

export default App;
