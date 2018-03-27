import React from 'react';
import { Segment, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const NewTodo = ({ onNewTodoClick }) => (
  <Segment>
    <Input
      action={{
        content: 'Add',
        onClick: e => onNewTodoClick(e.target.previousSibling.value),
      }}
      placeholder="New todo..."
    />
  </Segment>
);

NewTodo.propTypes = {
  onNewTodoClick: PropTypes.func.isRequired,
};

export default NewTodo;
