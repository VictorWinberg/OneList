import { mount } from 'enzyme';

import Index from '../../index';
import Root from '../../containers/Root';
import { store } from '../store';
import Products from '../../containers/products';
import Categories from '../../containers/categories';
import Settings from '../../containers/settings';
import Share from '../../containers/share';

describe('containers', () => {
  it('index renders without crashing', () => {
    expect(
      JSON.stringify({ ...Index, _reactInternalFiber: 'circular' })
    ).toBeDefined();
  });

  it('Products renders ProductList with ListItem', () => {
    const list = mount(Root(Products, store)).find('ProductList');
    expect(list.find('.section').text()).toEqual('Dairy');
    expect(
      list
        .find('.active')
        .find('ListItem')
        .find('label')
        .text()
    ).toEqual('Milk');
    expect(
      list
        .find('.done')
        .find('ListItem')
        .find('label')
        .text()
    ).toEqual('Potatoes');
  });

  it('Categories renders CategoryList with ListItem', () => {
    expect(
      mount(Root(Categories, store))
        .find('CategoryList')
        .find('ListItem')
        .find('label')
        .text()
    ).toEqual('Dairy');
  });

  it('Settings renders without crashing', () => {
    expect(mount(Root(Settings, store))).toBeDefined();
  });

  it('Share renders without crashing', () => {
    expect(mount(Root(Share, store))).toBeDefined();
  });
});
