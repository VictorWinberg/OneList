import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import makeStore from '../store';
import EditProduct from '../../containers/products/EditProduct';

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
}));

describe('Products', () => {
  let store;
  let history;

  beforeEach(() => {
    store = makeStore();
    history = [];
    fetch.resetMocks();
  });

  const renderWithProviders = (component) => {
    const mockHistory = {
      push: (url) => history.push(url),
    };

    return render(
      <Provider store={store}>
        <BrowserRouter>
          {React.cloneElement(component, { history: mockHistory })}
        </BrowserRouter>
      </Provider>
    );
  };

  it('should edit a product with new category', async () => {
    const user = userEvent.setup();
    // Mock both the PUT and the subsequent GET from fetchProducts
    fetch.mockResponseOnce('{}'); // PUT response
    fetch.mockResponseOnce('[{"id": 1, "name": "Data"}]'); // GET response from fetchProducts

    renderWithProviders(
      <EditProduct
        match={{ params: { id: 2 } }}
        history={{ push: (url) => history.push(url) }}
        location={{ query: {} }}
      />
    );

    const nameInput = screen.getByLabelText(/edit.name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Melody potatoes');

    const amountInput = screen.getByLabelText(/edit.amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, '3');

    const unitInput = document.getElementById('productAmountUnit');
    if (unitInput) {
      await user.clear(unitInput);
      await user.type(unitInput, 'kg');
    }

    // Find and interact with CategorySelect
    const categorySelect =
      screen.getByLabelText(/edit.category/i) ||
      document.querySelector('select');
    if (categorySelect) {
      await user.selectOptions(
        categorySelect,
        categorySelect.options[2]?.value || ''
      );
    }

    // Find new category input if it appears
    const newCategoryInput = document.querySelector(
      'input[placeholder*="category"], input[placeholder*="Category"]'
    );
    if (newCategoryInput) {
      await user.type(newCategoryInput, 'Potatoes');
    }

    // Submit form
    const submitButton = screen.getByText(/edit.save/i);
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(history).toEqual(['/']);
        const actions = store.getActions();
        const fetchProductsAction = actions.find(
          (a) => a.type === 'FETCH_PRODUCTS'
        );
        expect(fetchProductsAction).toBeDefined();
        expect(fetchProductsAction).toEqual({
          type: 'FETCH_PRODUCTS',
          products: [{ id: 1, name: 'Data' }],
        });
      },
      { timeout: 3000 }
    );
  });

  it('should cancel on cancel button', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditProduct
        match={{ params: { id: 2 } }}
        history={{ push: (url) => history.push(url) }}
        location={{ query: {} }}
      />
    );

    const cancelButton = screen.getByText(/edit.cancel/i);
    await user.click(cancelButton);

    expect(history).toEqual(['/']);
    expect(store.getActions()).toEqual([]);
  });
});
