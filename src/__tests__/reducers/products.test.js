import products from '../../reducers/products';
import { addProduct, toggleProduct } from '../../actions/products';

const testProducts = [
  {
    id: 1,
    text: 'Test',
    completed: false,
  },
];

describe('products reducer', () => {
  it('has a default state', () => {
    expect(products(undefined, { type: 'unexpected' })).toEqual([]);
  });

  it('can handle ADD_PRODUCT', () => {
    expect(products(undefined, addProduct('Test'))).toEqual(testProducts);
  });

  it('can handle TOGGLE_PRODUCT', () => {
    expect(products(testProducts, toggleProduct(1))).toEqual(
      testProducts.map(product => ({ ...product, completed: true }))
    );
    expect(products(testProducts, toggleProduct(2))).toEqual(testProducts);
  });
});
