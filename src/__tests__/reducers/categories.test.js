import makeStore, { store } from '../store';
import categories from '../../reducers/categories';
import {
  addCategory,
  editCategory,
  removeCategory,
  reorderCategory,
  fetchCategories,
} from '../../actions/categories';

describe('categories reducer', () => {
  const { dispatch } = store;
  it('has a default state', () => {
    expect(categories(undefined, { type: 'unexpected' })).toEqual([]);
  });

  it('can handle ADD_CATEGORY', async () => {
    fetch.mockResponse(
      JSON.stringify([{
        id: 1,
        name: 'Vegetables',
      }])
    );
    const state = await dispatch(addCategory({ name: 'Vegetables' }));
    expect(categories(undefined, state)).toEqual([
      {
        id: 1,
        name: 'Vegetables',
      },
    ]);
  });

  it('can handle ADD_CATEGORY for None', () => {
    expect(categories(undefined, dispatch(addCategory({})))).toEqual([]);
  });

  it('can handle REORDER_CATEGORY', async () => {
    expect(
      categories(
        [
          {
            id: 1,
            name: 'Vegetables',
            orderidx: 1,
          },
          {
            id: 2,
            name: 'Meat',
            orderidx: 2,
          },
        ],
        await dispatch(reorderCategory({ startIndex: 1, endIndex: 2 }))
      )
    ).toEqual([
      {
        id: 2,
        name: 'Meat',
        orderidx: 1,
      },
      {
        id: 1,
        name: 'Vegetables',
        orderidx: 2,
      },
    ]);
  });

  it('can handle FETCH_CATEGORIES', done => {
    const mockStore = makeStore();
    fetch.mockResponse(
      JSON.stringify([
        {
          id: 1,
          name: 'Vegetables',
        },
      ])
    );

    mockStore.dispatch(fetchCategories());

    setImmediate(() => {
      expect(mockStore.getActions()).toEqual([
        {
          type: 'FETCH_CATEGORIES',
          categories: [
            {
              id: 1,
              name: 'Vegetables',
            },
          ],
        },
      ]);
      done();
    });
  });
});
