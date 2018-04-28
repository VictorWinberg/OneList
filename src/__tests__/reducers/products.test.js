import products from '../../reducers/products';
import {
  addProduct,
  toggleProduct,
  removeProduct,
  removeProducts,
} from '../../actions/products';

const testProduct = [
  {
    id: 1,
    text: 'Milk',
    completed: false,
  },
];

describe('products reducer', () => {
  it('has a default state', () => {
    expect(products(undefined, { type: 'unexpected' })).toEqual([]);
  });

  it('can handle ADD_PRODUCT', () => {
    expect(products(undefined, addProduct('Milk'))).toEqual(testProduct);
  });

  it('can handle ADD_PRODUCT for None', () => {
    expect(products(undefined, addProduct(''))).toEqual([]);
  });

  it('can handle TOGGLE_PRODUCT', () => {
    expect(products(testProduct, toggleProduct(1))).toEqual(
      testProduct.map(product => ({ ...product, completed: true }))
    );
  });

  it('can handle REMOVE_PRODUCT', () => {
    expect(products(testProduct, removeProduct(1))).toEqual([]);
  });

  it('can handle REMOVE_PRODUCTS', () => {
    expect(
      products(
        [
          ...testProduct,
          { id: 2, text: 'Apple', completed: true },
          { id: 3, text: 'Pear', completed: true },
        ],
        removeProducts()
      )
    ).toEqual(testProduct);
  });
});
