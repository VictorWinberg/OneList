import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const state = {
  locale: {
    languages: [{ code: 'en', active: true }],
    translations: {},
    options: {},
  },
  stores: { list: [{ id: 1, name: 'ICA' }], activeStoreId: 1 },
  categories: [{ id: 1, name: 'Dairy', orderidx: 1 }],
  products: [
    { id: 1, name: 'Milk', category: 1, inactive: false, checked: false, uid: 0 },
    { id: 2, name: 'Potatoes', inactive: false, checked: true, uid: 0 },
    { id: 3, name: 'Butter', inactive: true, uid: 0 },
  ],
  user: { id: 1, store: 'ICA', isCollaboration: true },
};

const mockStore = configureStore([thunk]);
const makeStore = () => mockStore(state);

it('should have make store with state', () => {
  expect(makeStore().getState()).toEqual(state);
});

export const store = makeStore();
export default makeStore;
