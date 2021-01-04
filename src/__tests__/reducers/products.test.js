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

const id = () => ({})

describe('products reducer', () => {
  const { dispatch } = store;
  it('has a default state', () => {
    expect(products(undefined, { type: 'unexpected' })).toEqual([]);
  });

  it('can handle ADD_PRODUCT', async () => {
    fetch.mockResponse(
      JSON.stringify([{
        id: 1,
        name: 'Milk',
      }])
    );
    const state = await dispatch(addProduct({ name: 'Milk' }));
    expect(products(undefined, state)).toEqual(testProduct);
  });

  it('can handle ADD_PRODUCT for None', () => {
    expect(products(undefined, dispatch(addProduct({})))).toEqual([]);
  });

  it('can handle TOGGLE_PRODUCT_CHECKED', async () => {
    fetch.mockResponse(
      JSON.stringify([{
        id: 1,
        name: 'Milk',
        checked: true
      }])
    );
    expect(products(testProduct, await dispatch(toggleProductChecked(1)))).toEqual(
      testProduct.map(product => ({ ...product, checked: true }))
    );
  });
  it('can handle TOGGLE_PRODUCT_INACTIVE', async () => {
    fetch.mockResponse(
      JSON.stringify([{
        id: 1,
        name: 'Milk',
        checked: null
      }])
    );
    expect(products(testProduct, await dispatch(toggleProductInactive(1, id)))).toEqual(
      testProduct.map(product => ({ ...product, checked: null }))
    );
  });

  it('can handle REMOVE_PRODUCT', async () => {
    fetch.mockResponse(JSON.stringify([]));
    expect(products(testProduct, await dispatch(removeProduct(1)))).toEqual([]);
  });

  it('can handle INACTIVATE_PRODUCTS', async () => {
    fetch.mockResponse(
      JSON.stringify([
        { id: 1, name: 'Milk' },
        { id: 2, name: 'Apple', checked: null },
        { id: 3, name: 'Pear', checked: null }
      ])
    );
    expect(
      products(
        [
          ...testProduct,
          { id: 2, name: 'Apple', checked: true },
          { id: 3, name: 'Pear', checked: true },
        ],
        await dispatch(inactivateProducts(null, id))
      )
    ).toEqual([
      ...testProduct,
      { id: 2, name: 'Apple', checked: null },
      { id: 3, name: 'Pear', checked: null },
    ]);
  });

  it('can handle FETCH_PRODUCTS', done => {
    const mockStore = makeStore();
    fetch.mockResponse(
      JSON.stringify([
        {
          id: 1,
          name: 'Milk',
        },
      ])
    );

    mockStore.dispatch(fetchProducts());

    setImmediate(() => {
      expect(mockStore.getActions()).toEqual([
        {
          type: 'FETCH_PRODUCTS',
          products: [
            {
              id: 1,
              name: 'Milk',
            },
          ],
        },
      ]);
      done();
    });
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
