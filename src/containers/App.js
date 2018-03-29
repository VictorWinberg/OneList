import React from 'react';
import { Container, Header, Grid, Segment, Image } from 'semantic-ui-react';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/filter';

import TodoList from './TodoList';
import Filter from './Filter';
import NewTodo from './NewTodo';

const App = () => (
  <Container textAlign="center" fluid>
    <Segment inverted>
      <Image src="icons/wishlist.svg" size="small" centered />
      <Header as="h2" textAlign="center">
        ShoppingList
      </Header>
    </Segment>
    <Filter filter={SHOW_ALL}>{SHOW_ALL}</Filter>
    <Filter filter={SHOW_COMPLETED}>{SHOW_COMPLETED}</Filter>
    <Filter filter={SHOW_ACTIVE}>{SHOW_ACTIVE}</Filter>
    <TodoList />
    <Grid centered>
      <Grid.Row>
        <NewTodo />
      </Grid.Row>
    </Grid>
  </Container>
);

export default App;
