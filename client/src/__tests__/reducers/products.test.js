import makeStore, { store } from '../store';
import products from '../../reducers/products';
import {
  addProduct,
  editProduct,
  toggleProductChecked,
  toggleProductInactive,
  removeProduct,
  inactivateProducts,
  fetchProducts,
} from '../../actions/products';

const testProduct = [
  {
    id: 1,
    name: 'Milk',
  },
];

const id = () => ({});

describe('products reducer', () => {
  const { dispatch } = store;

  beforeEach(() => {
    fetch.resetMocks();
  });

  it('has a default state', () => {
    expect(products(undefined, { type: 'unexpected' })).toEqual([]);
  });

  it('can handle ADD_PRODUCT', async () => {
    const mockStore = makeStore();
    // Mock both the POST and the subsequent GET from fetchProducts
    fetch.mockResponseOnce('{}', { status: 200 }); // POST response
    fetch.mockResponseOnce(
      JSON.stringify([
        {
          id: 1,
          name: 'Milk',
        },
      ]),
      { status: 200 }
    ); // GET response from fetchProducts
    await mockStore.dispatch(addProduct({ name: 'Milk' }));
    // Wait a bit for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));
    const actions = mockStore.getActions();
    // Find the FETCH_PRODUCTS action
    const fetchAction = actions.find((a) => a.type === 'FETCH_PRODUCTS');
    expect(fetchAction).toBeDefined();
    expect(products(undefined, fetchAction)).toEqual(testProduct);
  });

  it('can handle ADD_PRODUCT for None', () => {
    expect(products(undefined, dispatch(addProduct({})))).toEqual([]);
  });

  it('can handle TOGGLE_PRODUCT_CHECKED', async () => {
    const mockStore = makeStore();
    // Mock both the PUT and the subsequent GET from fetchProducts
    fetch.mockResponseOnce('{}', { status: 200 }); // PUT response
    fetch.mockResponseOnce(
      JSON.stringify([
        {
          id: 1,
          name: 'Milk',
          checked: true,
        },
      ]),
      { status: 200 }
    ); // GET response from fetchProducts
    await mockStore.dispatch(toggleProductChecked({ id: 1, uid: 0 }));
    // Wait a bit for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));
    const actions = mockStore.getActions();
    const fetchAction = actions.find((a) => a.type === 'FETCH_PRODUCTS');
    expect(fetchAction).toBeDefined();
    expect(products(testProduct, fetchAction)).toEqual(
      testProduct.map((product) => ({ ...product, checked: true }))
    );
  });
  it('can handle TOGGLE_PRODUCT_INACTIVE', async () => {
    const mockStore = makeStore();
    // Mock both the PUT and the subsequent GET from fetchProducts
    fetch.mockResponseOnce('{}', { status: 200 }); // PUT response
    fetch.mockResponseOnce(
      JSON.stringify([
        {
          id: 1,
          name: 'Milk',
          checked: null,
        },
      ]),
      { status: 200 }
    ); // GET response from fetchProducts
    await mockStore.dispatch(toggleProductInactive({ id: 1 }, id));
    // Wait a bit for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));
    const actions = mockStore.getActions();
    const fetchAction = actions.find((a) => a.type === 'FETCH_PRODUCTS');
    expect(fetchAction).toBeDefined();
    expect(products(testProduct, fetchAction)).toEqual(
      testProduct.map((product) => ({ ...product, checked: null }))
    );
  });

  it('can handle REMOVE_PRODUCT', async () => {
    const mockStore = makeStore();
    // Mock both the DELETE and the subsequent GET from fetchProducts
    fetch.mockResponseOnce('{}', { status: 200 }); // DELETE response
    fetch.mockResponseOnce(JSON.stringify([]), { status: 200 }); // GET response from fetchProducts
    await mockStore.dispatch(removeProduct(1));
    // Wait a bit for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));
    const actions = mockStore.getActions();
    const fetchAction = actions.find((a) => a.type === 'FETCH_PRODUCTS');
    expect(fetchAction).toBeDefined();
    expect(products(testProduct, fetchAction)).toEqual([]);
  });

  it('can handle INACTIVATE_PRODUCTS', async () => {
    const mockStore = makeStore();
    // Mock both the PUT and the subsequent GET from fetchProducts
    fetch.mockResponseOnce('{}', { status: 200 }); // PUT response
    fetch.mockResponseOnce(
      JSON.stringify([
        { id: 1, name: 'Milk' },
        { id: 2, name: 'Apple', checked: null },
        { id: 3, name: 'Pear', checked: null },
      ]),
      { status: 200 }
    ); // GET response from fetchProducts
    await mockStore.dispatch(inactivateProducts(null, id));
    // Wait a bit for async operations
    await new Promise((resolve) => setTimeout(resolve, 100));
    const actions = mockStore.getActions();
    const fetchAction = actions.find((a) => a.type === 'FETCH_PRODUCTS');
    expect(fetchAction).toBeDefined();
    expect(
      products(
        [
          ...testProduct,
          { id: 2, name: 'Apple', checked: true },
          { id: 3, name: 'Pear', checked: true },
        ],
        fetchAction
      )
    ).toEqual([
      ...testProduct,
      { id: 2, name: 'Apple', checked: null },
      { id: 3, name: 'Pear', checked: null },
    ]);
  });

  it('can handle FETCH_PRODUCTS', (done) => {
    const mockStore = makeStore();
    fetch.mockResponseOnce(
      JSON.stringify([
        {
          id: 1,
          name: 'Milk',
        },
      ]),
      { status: 200 }
    );

    mockStore.dispatch(fetchProducts());

    setTimeout(() => {
      const actions = mockStore.getActions();
      const fetchAction = actions.find((a) => a.type === 'FETCH_PRODUCTS');
      expect(fetchAction).toBeDefined();
      expect(fetchAction).toEqual({
        type: 'FETCH_PRODUCTS',
        products: [
          {
            id: 1,
            name: 'Milk',
          },
        ],
      });
      done();
    }, 100);
  });

  it('can handle ERRORS', () => {
    fetch.resetMocks();
    fetch.mockReject('Error');

    dispatch(addProduct({ name: 'Milk' }));
    dispatch(editProduct({ id: 1, name: 'Milk' }));
    dispatch(toggleProductChecked(1));
    dispatch(toggleProductInactive(1, id));
    dispatch(removeProduct(1));
    dispatch(inactivateProducts(null, id));
    dispatch(fetchProducts());

    expect(fetch.mock.calls.length).toEqual(7);
  });
});
