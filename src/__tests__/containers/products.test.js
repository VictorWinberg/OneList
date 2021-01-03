import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import makeStore from '../store';
import EditProduct from '../../containers/products/EditProduct';

describe('Products', () => {
  let store;
  let wrapper;
  let history;

  beforeEach(() => {
    store = makeStore();
    history = [];
    fetch.resetMocks();
    wrapper = mount(
      <Provider store={store}>
        <EditProduct
          match={{ params: { id: 2 } }}
          history={{ push: url => history.push(url) }}
          location={{query: {}}}
        />
      </Provider>
    );
  });

  it('should edit a product with new category', done => {
    fetch.mockResponse('[{"id": 1, "name": "Data"}]');

    wrapper.find('input#productName').instance().value = 'Melody potatoes';
    wrapper.find('input#productAmountText').instance().value = '3';
    wrapper.find('input#productAmountUnit').instance().value = 'kg';

    wrapper
      .find('CategorySelect')
      .find('select')
      .simulate('change', {
        target: { selectedIndex: 2, options: ['None', 'Dairy', 'New'] },
      });

    wrapper
      .find('CategorySelect')
      .find('input')
      .first()
      .instance().value = 'Potatoes';

    wrapper.find('form').simulate('submit', { preventDefault() {} });

    setImmediate(() => {
      expect(history).toEqual(['/']);
      expect(store.getActions()).toEqual([
        {
          type: 'FETCH_PRODUCTS',
          products: [{ id: 1, name: 'Data' }],
        },
        {
          type: 'FETCH_CATEGORIES',
          categories: [{ id: 1, name: 'Data' }],
        },
      ]);
      done();
    });
  });

  it('should cancel on cancel button', () => {
    wrapper.find('.cancelBtn').simulate('click');

    expect(history).toEqual(['/']);
    expect(store.getActions()).toEqual([]);
  });
});
