import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import store from '../store';
import EditProduct from '../../containers/products/EditProduct';

describe('Products', () => {
  it('should edit a product', () => {
    const history = { push: () => null };
    const wrapper = mount(
      <Provider store={store}>
        <EditProduct match={{ params: { id: 2 } }} history={history} />
      </Provider>
    );

    wrapper.find('input').instance().value = 'Melody potatoes';
    wrapper
      .find('CategorySelect')
      .find('select')
      .simulate('change', {
        target: { selectedIndex: 2, options: ['None', 'Diary', 'New'] },
      });
    wrapper
      .find('CategorySelect')
      .find('input')
      .first()
      .instance().value =
      'Potatoes';

    wrapper.find('form').simulate('submit', { preventDefault() {} });
    expect(store.getActions()).toEqual([
      { type: 'ADD_CATEGORY', name: 'Potatoes' },
      {
        type: 'EDIT_PRODUCT',
        id: 2,
        name: 'Melody potatoes',
        category: '2',
      },
    ]);
  });
});
