import React from 'react';
import { Route } from 'react-router-dom';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/filter';

import TodoList from './TodoList';
import Filter from './Filter';
import NewTodo from './NewTodo';
import Header from '../components/Header';

const App = () => (
  <div>
    <Header />
    <Route exact path="/" render={() => <h1>Shopping View</h1>} />
    <Route path="/categories" render={() => <h1>Categories View</h1>} />
    <Route path="/share" render={() => <h1>Share View</h1>} />
    <Route path="/settings" render={() => <h1>Settings View</h1>} />
    <NewTodo />
    <Filter filter={SHOW_ALL} />
    <Filter filter={SHOW_COMPLETED} />
    <Filter filter={SHOW_ACTIVE} />
    <TodoList />
  </div>
);

export default App;
