import React from 'react';
import { Container, Header, Image } from 'semantic-ui-react';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/filter';

import TodoList from './TodoList';
import Filter from './Filter';
import NewTodo from './NewTodo';

const App = () => (
  <Container
    style={{
      margin: '1em',
      height: '-webkit-fill-available',
      backgroundImage: 'url("/lofi.png")',
    }}
  >
    <Header as="h2">OneList - Shopping List</Header>
    <Image src="/icons/onelist.svg" size="small" centered />
    <Filter filter={SHOW_ALL}>{SHOW_ALL}</Filter>
    <Filter filter={SHOW_COMPLETED}>{SHOW_COMPLETED}</Filter>
    <Filter filter={SHOW_ACTIVE}>{SHOW_ACTIVE}</Filter>
    <TodoList />
    <NewTodo />
  </Container>
);

export default App;
