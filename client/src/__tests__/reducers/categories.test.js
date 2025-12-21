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

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('has a default state', () => {
    expect(categories(undefined, { type: 'unexpected' })).toEqual([]);
  });

  it('can handle ADD_CATEGORY', async () => {
    const mockStore = makeStore();
    // Mock both the POST and the subsequent GET from fetchCategories
    fetch.mockResponseOnce('{}', { status: 200 }); // POST response
    fetch.mockResponseOnce(
      JSON.stringify([
        {
          id: 1,
          name: 'Vegetables',
        },
      ]),
      { status: 200 }
    ); // GET response from fetchCategories
    await mockStore.dispatch(addCategory({ name: 'Vegetables' }));
    // Wait a bit for async operations
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    const actions = mockStore.getActions();
    const fetchAction = actions.find((a) => a.type === 'FETCH_CATEGORIES');
    expect(fetchAction).toBeDefined();
    expect(categories(undefined, fetchAction)).toEqual([
      {
        id: 1,
        name: 'Vegetables',
      },
    ]);
  });

  it('can handle ADD_CATEGORY for None', () => {
    expect(categories(undefined, dispatch(addCategory({})))).toEqual([]);
  });

  it('can handle EDIT_CATEGORY', async () => {
    const mockStore = makeStore();
    // Mock both the PUT and the subsequent GET from fetchCategories
    fetch.mockResponseOnce('{}', { status: 200 }); // PUT response
    fetch.mockResponseOnce(
      JSON.stringify([
        {
          id: 1,
          name: 'Edit',
          color: '#fff',
        },
      ]),
      { status: 200 }
    ); // GET response from fetchCategories

    await mockStore.dispatch(
      editCategory({ id: 1, name: 'Edit', color: '#fff' })
    );
    // Wait a bit for async operations
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    const actions = mockStore.getActions();
    const fetchAction = actions.find((a) => a.type === 'FETCH_CATEGORIES');
    expect(fetchAction).toBeDefined();

    expect(
      categories(
        [
          {
            id: 1,
            name: 'Vegetables',
          },
        ],
        fetchAction
      )
    ).toEqual([
      {
        id: 1,
        name: 'Edit',
        color: '#fff',
      },
    ]);
  });

  it('can handle REORDER_CATEGORY', async () => {
    const mockStore = makeStore();
    // Mock both the PUT and the subsequent GET from fetchCategories
    fetch.mockResponseOnce('{}', { status: 200 }); // PUT response
    fetch.mockResponseOnce(
      JSON.stringify([
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
      ]),
      { status: 200 }
    ); // GET response from fetchCategories

    await mockStore.dispatch(reorderCategory({ startIndex: 1, endIndex: 2 }));
    // Wait a bit for async operations
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    const actions = mockStore.getActions();
    const fetchAction = actions.find((a) => a.type === 'FETCH_CATEGORIES');
    expect(fetchAction).toBeDefined();

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
        fetchAction
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

  it('can handle REMOVE_CATEGORY', async () => {
    const mockStore = makeStore();
    // Mock both the DELETE and the subsequent GET from fetchCategories
    fetch.mockResponseOnce('{}', { status: 200 }); // DELETE response
    fetch.mockResponseOnce(
      JSON.stringify([
        {
          id: 2,
          name: 'Meat',
        },
      ]),
      { status: 200 }
    ); // GET response from fetchCategories

    await mockStore.dispatch(removeCategory(1));
    // Wait a bit for async operations
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    const actions = mockStore.getActions();
    const fetchAction = actions.find((a) => a.type === 'FETCH_CATEGORIES');
    expect(fetchAction).toBeDefined();

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
        fetchAction
      )
    ).toEqual([
      {
        id: 2,
        name: 'Meat',
      },
    ]);
  });

  it('can handle FETCH_CATEGORIES', (done) => {
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

    setTimeout(() => {
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
    }, 0);
  });
});
