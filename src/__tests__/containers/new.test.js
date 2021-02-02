import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import { store } from '../store';
import New from '../../containers/common/New';

describe('New', () => {
  it('should add item', () => {
    const component = mount(
      <Provider store={store}>
        <New view="test" onAdd={item => ({ type: 'ADD', ...item })} />
      </Provider>
    );
    component.find('input').simulate('change', { target: { value: 'Milk' } });
    component.find('form').simulate('submit', { preventDefault() {} });
    expect(store.getActions()).toEqual([
      { type: 'ADD', name: 'Milk', uid: undefined },
    ]);
  });

  it('should add autosuggest item', () => {
    const wrapper = mount(
      <Provider store={store}>
        <New view="test" onAdd={item => ({ type: 'ADD', ...item })} />
      </Provider>
    );

    // wrapper.find('input').prop('onFocus')();
    wrapper.find('input').simulate('focus');
    wrapper.find('input').simulate('change', { target: { value: 'Mi' } });
    console.log(
      'focused:',
      wrapper.find('input').props().id === document.activeElement.id
    );
    console.log(wrapper.find('input').html());
    console.log(store.getActions());
  });
});
