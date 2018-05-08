import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import New from '../../containers/common/New';

const mockStore = configureStore();

const store = mockStore({
  locale: {
    languages: [{ code: 'en', active: true }],
    translations: {},
  },
});

describe('New', () => {
  it('should add item', () => {
    const context = { store };
    const component = shallow(
      <New view="test" onAdd={item => ({ type: 'ADD', ...item })} />,
      { context }
    ).dive();
    component.find('input').simulate('change', { target: { value: 'Milk' } });
    component.find('form').simulate('submit', { preventDefault() {} });
    expect(store.getActions()).toEqual([
      { type: 'ADD', name: 'Milk', category: null },
    ]);
  });

  it('should add autosuggest item', () => {
    const component = mount(
      <Provider store={store}>
        <New view="test" onAdd={item => ({ type: 'ADD', ...item })} />
      </Provider>
    ).find(New);

    // component.find('input').prop('onFocus')();
    component.find('input').simulate('focus');
    component.find('input').simulate('change', { target: { value: 'Mi' } });
    console.log(
      'focused:',
      component.find('input').props().id === document.activeElement.id
    );
    console.log(component.find('input').html());
    console.log(store.getActions());
  });
});
