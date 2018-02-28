import React from 'react';
import { Container, Segment, Header, Image } from 'semantic-ui-react';

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
  </Container>
);

export default App;
