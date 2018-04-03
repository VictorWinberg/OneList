import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NewTodo extends Component {
  constructor(props) {
    super(props);

    this.state = { todo: '' };
  }

  handleSubmit(event) {
    const { todo } = this.state;
    const { onNewTodoClick } = this.props;

    onNewTodoClick(todo);
    this.setState({ todo: '' });
    event.preventDefault();
  }

  render() {
    const { todo } = this.state;

    return (
      <form onSubmit={event => this.handleSubmit(event)}>
        <input
          value={todo}
          placeholder="New todo..."
          onChange={event => this.setState({ todo: event.target.value })}
        />
      </form>
    );
  }
}

NewTodo.propTypes = {
  onNewTodoClick: PropTypes.func.isRequired,
};

export default NewTodo;
