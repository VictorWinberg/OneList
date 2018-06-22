import makeStore, { store } from '../store';
import products from '../../reducers/products';
import {
  addProduct,
  toggleProduct,
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

describe('products reducer', () => {
  const { dispatch } = store;
  it('has a default state', () => {
    expect(products(undefined, { type: 'unexpected' })).toEqual([]);
  });

  it('can handle ADD_PRODUCT', () => {
    expect(products(undefined, dispatch(addProduct({ name: 'Milk' })))).toEqual(
      testProduct
    );
  });

  it('can handle ADD_PRODUCT for None', () => {
    expect(products(undefined, dispatch(addProduct({})))).toEqual([]);
  });

  it('can handle TOGGLE_PRODUCT', () => {
    expect(products(testProduct, dispatch(toggleProduct(1)))).toEqual(
      testProduct.map(product => ({ ...product, checked: true }))
    );
  });

  it('can handle REMOVE_PRODUCT', () => {
    expect(products(testProduct, dispatch(removeProduct(1)))).toEqual([]);
  });

  it('can handle INACTIVATE_PRODUCTS', () => {
    expect(
      products(
        [
          ...testProduct,
          { id: 2, name: 'Apple', checked: true },
          { id: 3, name: 'Pear', checked: true },
        ],
        dispatch(inactivateProducts())
      )
    ).toEqual([
      ...testProduct,
      { id: 2, name: 'Apple', checked: true, inactive: true },
      { id: 3, name: 'Pear', checked: true, inactive: true },
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
});
