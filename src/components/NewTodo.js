import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NewTodo extends Component {
  constructor(props) {
    super(props);

    this.state = { todo: '' };
  }

  handleSubmit() {
    const { todo } = this.state;
    const { onNewTodoClick } = this.props;

    onNewTodoClick(todo);
    this.setState({ todo: '' });
  }

  render() {
    const { todo } = this.state;

    return (
      <form onSubmit={() => this.handleSubmit()}>
        <input
          name="todo"
          value={todo}
          placeholder="New todo..."
          action="Add"
          onChange={(event, { name, value }) =>
            this.setState({ [name]: value })
          }
        />
      </form>
    );
  }
}

NewTodo.propTypes = {
  onNewTodoClick: PropTypes.func.isRequired,
};

export default NewTodo;
