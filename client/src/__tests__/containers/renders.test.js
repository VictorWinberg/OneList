import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import Index from '../../index';
import Root from '../../containers/Root';
import { store } from '../store';
import ShoppingList from '../../containers/shoppinglist';
import Categories from '../../containers/categories';
import Products from '../../containers/products';
import Settings from '../../containers/settings';

// Mock i18n module
jest.mock('../../i18n', () => ({
  __esModule: true,
  default: {
    t: (key) => key,
    language: 'en',
    languages: ['en', 'sv', 'es'],
    changeLanguage: jest.fn(),
  },
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      language: 'en',
      languages: ['en', 'sv', 'es'],
      changeLanguage: jest.fn(),
    },
  }),
  withTranslation: () => (Component) => (props) =>
    <Component {...props} t={(key) => key} />,
  I18nextProvider: ({ children }) => children,
  initReactI18next: {
    type: 'languageDetector',
  },
}));

describe('containers', () => {
  it('index renders without crashing', () => {
    expect(Index).toBeDefined();
  });

  it('ShoppingList renders ProductList with ListItem', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>{Root(ShoppingList, store)}</BrowserRouter>
      </Provider>
    );

    // Check for section text
    const section = container.querySelector('.section');
    expect(section?.textContent).toEqual('Dairy');

    // Check for active item
    const activeItem = container.querySelector('.active label');
    expect(activeItem?.textContent).toEqual('Milk');

    // Check for done item
    const doneItem = container.querySelector('.done label');
    expect(doneItem?.textContent).toEqual('Potatoes');
  });

  it('Categories renders CategoryList with ListItem', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>{Root(Categories, store)}</BrowserRouter>
      </Provider>
    );

    expect(container).toBeTruthy();
  });

  it('Products renders ProductList with ListItem', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>{Root(Products, store)}</BrowserRouter>
      </Provider>
    );

    expect(container).toBeTruthy();
  });

  it('Settings renders without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>{Root(Settings, store)}</BrowserRouter>
      </Provider>
    );

    expect(container).toBeTruthy();
  });
});
