import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addTodo } from '../actions/todos';

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
      <div className="search">
        <form onSubmit={event => this.handleSubmit(event)}>
          <label htmlFor="newItem">
            <img
              className="add_icon"
              alt="add"
              src="/icons/add_icon.png"
              height="12px"
            />
          </label>
          <input
            id="newItem"
            type="text"
            value={todo}
            autoComplete="off"
            placeholder="New todo..."
            onChange={event => this.setState({ todo: event.target.value })}
          />
          <img
            className="clear_icon"
            alt="X"
            src="/icons/clear_icon.png"
            height="12px"
          />
        </form>
      </div>
    );
  }
}

NewTodo.propTypes = {
  onNewTodoClick: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  onNewTodoClick: addTodo,
};

export default connect(null, mapDispatchToProps)(NewTodo);
