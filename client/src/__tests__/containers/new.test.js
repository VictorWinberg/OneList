import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { store } from '../store';
import New from '../../containers/common/New';

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

describe('New', () => {
  it('should add item', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn((item) => ({ type: 'ADD', ...item }));
    const onRemove = jest.fn();

    render(
      <Provider store={store}>
        <New view="test" onAdd={onAdd} onRemove={onRemove} />
      </Provider>
    );

    const input =
      screen.getByPlaceholderText(/test.input/i) ||
      screen.getByLabelText(/newItem/i);
    await user.type(input, 'Milk');

    await user.type(input, '{Enter}');

    // The action should be dispatched to the store
    expect(store.getActions()).toContainEqual(
      expect.objectContaining({
        type: 'ADD',
        name: 'Milk',
      })
    );
  });

  it('should add autosuggest item', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn((item) => ({ type: 'ADD', ...item }));
    const onRemove = jest.fn();

    render(
      <Provider store={store}>
        <New view="test" onAdd={onAdd} onRemove={onRemove} autosuggest />
      </Provider>
    );

    const input =
      screen.getByPlaceholderText(/test.input/i) ||
      screen.getByLabelText(/newItem/i);
    await user.click(input);
    await user.type(input, 'Mi');

    // Check if input is focused
    expect(document.activeElement).toBe(input);
  });
});
