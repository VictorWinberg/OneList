import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const state = {
  locale: {
    languages: [{ code: 'en', active: true }],
    translations: {},
    options: {},
  },
  categories: [{ id: 1, name: 'Dairy' }],
  products: [
    { id: 1, name: 'Milk', category: 1, active: true, checked: false },
    { id: 2, name: 'Potatoes', active: true, checked: true },
    { id: 3, name: 'Butter', active: false },
  ],
  collaborators: [],
  user: {},
};

const mockStore = configureStore([thunk]);
const makeStore = () => mockStore(state);

it('should have make store with state', () => {
  expect(makeStore().getState()).toEqual(state);
});

export const store = makeStore();
export default makeStore;