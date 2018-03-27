import { connect } from 'react-redux';

import { addTodo } from '../actions/todos';
import NewTodo from '../components/NewTodo';

const mapDispatchToProps = {
  onNewTodoClick: addTodo,
};

export default connect(null, mapDispatchToProps)(NewTodo);
