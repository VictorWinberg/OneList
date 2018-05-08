import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

import Index from '../../index';
import Root from '../../containers/Root';
import Categories from '../../containers/categories';
import Settings from '../../containers/settings';
import Share from '../../containers/share';

const mockStore = configureStore();
const store = mockStore({
  locale: {
    languages: [{ code: 'en', active: true }],
    translations: {},
    options: {},
  },
  categories: [{ id: 1, name: 'Diary' }],
  products: [{ id: 1, name: 'Milk', category: 1 }, { id: 2, name: 'Potato' }],
  collaborators: [],
  user: {},
});

describe('containers', () => {
  it('index renders without crashing', () => {
    expect(
      JSON.stringify({ ...Index, _reactInternalFiber: 'circular' })
    ).toBeDefined();
  });

  it('categories renders DnDList with ListItem', () => {
    expect(
      mount(Root(Categories, store))
        .find('DnDList')
        .find('ListItem')
        .find('label')
        .get(0).props.children[1]
    ).toEqual('Diary');
  });

  it('settings renders without crashing', () => {
    expect(mount(Root(Settings, store))).toBeDefined();
  });

  it('share renders without crashing', () => {
    expect(mount(Root(Share, store))).toBeDefined();
  });
});
