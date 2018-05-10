import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);
const store = mockStore({
  locale: {
    languages: [{ code: 'en', active: true }],
    translations: {},
    options: {},
  },
  categories: [{ id: 1, name: 'Diary' }],
  products: [
    { id: 1, name: 'Milk', category: 1, active: true, checked: false },
    { id: 2, name: 'Potatoes', active: true, checked: true },
    { id: 3, name: 'Butter', active: false },
  ],
  collaborators: [],
  user: {},
});

it('should have mockStore', () => {
  expect(store).toBeDefined();
});

export default store;
