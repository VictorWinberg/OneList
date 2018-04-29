import categories from '../../reducers/categories';
import { addCategory, removeCategory } from '../../actions/categories';

describe('categories reducer', () => {
  it('has a default state', () => {
    expect(categories(undefined, { type: 'unexpected' })).toEqual([]);
  });

  it('can handle ADD_CATEGORY', () => {
    expect(categories(undefined, addCategory('Vegetables'))).toEqual([
      {
        id: 1,
        name: 'Vegetables',
      },
    ]);
  });

  it('can handle ADD_CATEGORY for None', () => {
    expect(categories(undefined, addCategory(''))).toEqual([]);
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
        removeCategory(1)
      )
    ).toEqual([
      {
        id: 2,
        name: 'Meat',
      },
    ]);
  });
});
