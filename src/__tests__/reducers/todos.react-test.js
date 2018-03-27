import todos from '../../reducers/todos';
import { addTodo, toggleTodo } from '../../actions/todos';

const testTodos = [
  {
    id: 1,
    text: 'Test',
    completed: false,
  },
];

describe('todos reducer', () => {
  it('has a default state', () => {
    expect(todos(undefined, { type: 'unexpected' })).toEqual([]);
  });

  it('can handle ADD_TODO', () => {
    expect(todos(undefined, addTodo('Test'))).toEqual(testTodos);
  });

  it('can handle TOGGLE_TODO', () => {
    expect(todos(testTodos, toggleTodo(1))).toEqual(
      testTodos.map(todo => ({ ...todo, completed: true }))
    );
    expect(todos(testTodos, toggleTodo(2))).toEqual(testTodos);
  });
});
