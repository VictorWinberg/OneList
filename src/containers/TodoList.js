import { connect } from 'react-redux';

import {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE,
} from '../constants/filter';

import { toggleTodo } from '../actions/todos';
import TodoList from '../components/TodoList';

const filterTodos = (todos, filter) => {
  switch (filter) {
    case SHOW_ALL:
      return todos;
    case SHOW_COMPLETED:
      return todos.filter(todo => todo.completed);
    case SHOW_ACTIVE:
      return todos.filter(todo => !todo.completed);
    default:
      throw new Error(`Unknown filter: ${filter}`);
  }
};

const mapStateToProps = state => ({
  todos: filterTodos(state.todos, state.filter),
});

const mapDispatchToProps = {
  onTodoClick: toggleTodo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
