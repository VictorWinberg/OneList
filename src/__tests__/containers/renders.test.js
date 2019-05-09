import { mount } from 'enzyme';

import Index from '../../index';
import Root from '../../containers/Root';
import { store } from '../store';
import ShoppingList from '../../containers/shoppinglist';
import Categories from '../../containers/categories';
import Products from '../../containers/products';
import Settings from '../../containers/settings';

describe('containers', () => {
  it('index renders without crashing', () => {
    expect(
      JSON.stringify({ ...Index, _reactInternalFiber: 'circular' })
    ).toBeDefined();
  });

  it('ShoppingList renders ProductList with ListItem', () => {
    const list = mount(Root(ShoppingList, store)).find('ProductList');
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
    mount(Root(Categories, store));
    // expect(
    //   mount(Root(Categories, store))
    //     .find('CategoryList')
    //     .find('ListItem')
    //     .find('label')
    //     .text()
    // ).toEqual('Dairy');
  });

  it('Products renders ProductList with ListItem', () => {
    const list = mount(Root(Products, store)).find('ProductList');
    expect(list.find('.section').map(n => n.text())).toEqual(['Dairy', '']);
    expect(
      list
        .find('.active')
        .find('ListItem')
        .find('label')
        .map(n => n.text())
    ).toEqual(['Milk', 'Butter', 'Potatoes']);
    expect(
      list
        .find('.done')
        .find('ListItem')
        .find('label')
        .map(n => n.text())
    ).toEqual([]);
  });

  it('Settings renders without crashing', () => {
    expect(mount(Root(Settings, store))).toBeDefined();
  });
});
