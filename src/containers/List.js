import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/filter';

import { toggleProduct, removeProducts } from '../actions/products';
import List from '../components/List';

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
  todos: filterTodos(state.products, SHOW_ACTIVE),
  doneTodos: filterTodos(state.products, SHOW_COMPLETED),
  translate: getTranslate(state.locale),
});

const mapDispatchToProps = {
  onTodoClick: toggleProduct,
  onRemoveProducts: removeProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
