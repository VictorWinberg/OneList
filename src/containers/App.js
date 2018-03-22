import React from 'react';
import { Container, Header, Segment, Image } from 'semantic-ui-react';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/filter';

import TodoList from './TodoList';
import Filter from './Filter';

const App = () => (
  <Container textAlign="center" fluid>
    <Segment inverted>
      <Image src="logo.svg" size="small" centered />
      <Header as="h2" textAlign="center">
        Welcome to React
      </Header>
    </Segment>
    <p>
      To get started, edit <code>src/containers/App.js</code> and save to
      reload.
    </p>
    <TodoList />
    <Filter filter={SHOW_ALL}>{SHOW_ALL}</Filter>
    <Filter filter={SHOW_COMPLETED}>{SHOW_COMPLETED}</Filter>
    <Filter filter={SHOW_ACTIVE}>{SHOW_ACTIVE}</Filter>
  </Container>
);

export default App;
