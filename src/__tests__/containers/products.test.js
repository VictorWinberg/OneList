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
        />
      </Provider>
    );
  });

  it('should edit a product with new category', done => {
    fetch.mockResponse('{}');

    wrapper.find('input').instance().value = 'Melody potatoes';

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
      .instance().value =
      'Potatoes';

    wrapper.find('form').simulate('submit', { preventDefault() {} });

    setImmediate(() => {
      expect(history).toEqual(['/']);
      expect(store.getActions()).toEqual([
        { type: 'ADD_CATEGORY', name: 'Potatoes' },
        {
          type: 'EDIT_PRODUCT',
          id: 2,
          name: 'Melody potatoes',
          category: 2,
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
