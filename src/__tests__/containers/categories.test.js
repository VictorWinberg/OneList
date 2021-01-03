import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import makeStore from '../store';
import EditCategory from '../../containers/categories/EditCategory';

describe('Categories', () => {
  let store;
  let wrapper;
  let history;

  beforeEach(() => {
    store = makeStore();
    history = [];
    wrapper = mount(
      <Provider store={store}>
        <EditCategory
          match={{ params: { id: 1 } }}
          history={{ push: url => history.push(url) }}
        />
      </Provider>
    );
  });

  it('should edit a category', () => {
    wrapper
      .find('input')
      .first()
      .instance().value =
      'Dairies';

    wrapper
      .find('CategoryColors')
      .find('button')
      .simulate('click');

    wrapper
      .find('CategoryColors')
      .find('li')
      .first()
      .simulate('click');

    wrapper.find('form').simulate('submit', { preventDefault() {} });

    expect(history).toEqual(['/categories']);
  });

  it('should cancel on cancel button', () => {
    wrapper.find('.cancelBtn').simulate('click');

    expect(history).toEqual(['/categories']);
    expect(store.getActions()).toEqual([]);
  });

  it('should remove a category', () => {
    wrapper.find('.deleteBtn').simulate('click');

    expect(history).toEqual(['/categories']);
  });
});
