import { store } from '../store';
import categories from '../../reducers/categories';
import { addCategory, removeCategory } from '../../actions/categories';

describe('categories reducer', () => {
  const { dispatch } = store;
  it('has a default state', () => {
    expect(categories(undefined, { type: 'unexpected' })).toEqual([]);
  });

  it('can handle ADD_CATEGORY', () => {
    expect(
      categories(undefined, dispatch(addCategory({ name: 'Vegetables' })))
    ).toEqual([
      {
        id: 1,
        name: 'Vegetables',
      },
    ]);
  });

  it('can handle ADD_CATEGORY for None', () => {
    expect(categories(undefined, dispatch(addCategory({})))).toEqual([]);
  });

  it('can handle REMOVE_CATEGORY', () => {
    expect(
      categories(
        [
          {
            id: 1,
            name: 'Vegetables',
          },
          {
            id: 2,
            name: 'Meat',
          },
        ],
        dispatch(removeCategory(1))
      )
    ).toEqual([
      {
        id: 2,
        name: 'Meat',
      },
    ]);
  });
});
