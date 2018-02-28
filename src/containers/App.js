import React from 'react';
import {
  Container,
  Header,
  Segment,
  Image,
} from 'semantic-ui-react';

import TodoList from './TodoList';

const App = () => (
  <Container textAlign="center" fluid>
    <Segment inverted>
      <Image src="logo.svg" size="small" centered />
      <Header as="h2" textAlign="center">
        Welcome to React
      </Header>
    </Segment>
    <p>
      To get started, edit <code>src/containers/App.js</code> and save to reload.
    </p>
    <TodoList />
  </Container>
);

export default App;
