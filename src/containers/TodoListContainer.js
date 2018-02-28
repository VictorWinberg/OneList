import { connect } from 'react-redux';

import { toggleTodo } from '../actions/todos';
import { VISIBILITY_FILTER } from '../constants';
import TodoList from '../components/TodoList';

const { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } = VISIBILITY_FILTER;

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

const TodoListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);

export default TodoListContainer;
