import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import makeStore from '../store';
import EditCategory from '../../containers/categories/EditCategory';

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

describe('Categories', () => {
  let store;
  let history;

  beforeEach(() => {
    store = makeStore();
    history = [];
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

  it('should edit a category', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(
      <EditCategory
        match={{ params: { id: 1 } }}
        history={{ push: (url) => history.push(url) }}
      />
    );

    const nameInput = screen.getByLabelText(/edit.category/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Dairies');

    // Find and click color button
    const colorButton = container.querySelector(
      '.CategoryColors button, [class*="CategoryColors"] button'
    );
    if (colorButton) {
      await user.click(colorButton);
    }

    // Find and click first color option
    const colorOption = container.querySelector(
      '.CategoryColors li, [class*="CategoryColors"] li'
    );
    if (colorOption) {
      await user.click(colorOption);
    }

    await user.click(screen.getByText(/edit.save/i));

    await waitFor(() => {
      expect(history).toEqual(['/categories']);
    });
  });

  it('should cancel on cancel button', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditCategory
        match={{ params: { id: 1 } }}
        history={{ push: (url) => history.push(url) }}
      />
    );

    const cancelButton = screen.getByText(/edit.cancel/i);
    await user.click(cancelButton);

    expect(history).toEqual(['/categories']);
    expect(store.getActions()).toEqual([]);
  });

  it('should remove a category', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <EditCategory
        match={{ params: { id: 1 } }}
        history={{ push: (url) => history.push(url) }}
      />
    );

    const deleteButton = screen.getByText(/edit.delete/i);
    await user.click(deleteButton);

    await waitFor(() => {
      expect(history).toEqual(['/categories']);
    });
  });
});
