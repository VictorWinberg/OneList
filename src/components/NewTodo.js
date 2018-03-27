import React from 'react';
import { Segment, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const NewTodo = ({ onNewTodoClick }) => (
  <Segment>
    <Input
      placeholder="New todo..."
      onKeyPress={e => {
        if (e.key === 'Enter') onNewTodoClick(e.target.value);
      }}
      action={{
        content: 'Add',
        onClick: e => onNewTodoClick(e.target.previousSibling.value),
      }}
    />
  </Segment>
);

NewTodo.propTypes = {
  onNewTodoClick: PropTypes.func.isRequired,
};

export default NewTodo;
