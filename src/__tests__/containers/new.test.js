import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import New from '../../containers/common/New';

const mockStore = configureStore();

describe('New', () => {
  it('should add item', () => {
    const store = mockStore({
      locale: {
        languages: [{ code: 'en', active: true }],
        translations: {},
      },
    });

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
});
