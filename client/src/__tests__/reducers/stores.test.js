import makeStore from '../store';
import stores from '../../reducers/stores';
import {
  fetchStores,
  setActiveStore,
  addStore,
  removeStore,
} from '../../actions/stores';
import { FETCH_STORES } from '../../constants/stores';
import { FETCH_CATEGORIES } from '../../constants/categories';
import { UPDATE_USER } from '../../constants/user';

describe('stores reducer', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('has a default state', () => {
    expect(stores(undefined, { type: 'unexpected' })).toEqual({
      list: [],
    });
  });

  it('can handle FETCH_STORES', () => {
    expect(
      stores(undefined, {
        type: FETCH_STORES,
        stores: [{ id: 1, name: 'ICA' }],
      })
    ).toEqual({
      list: [{ id: 1, name: 'ICA' }],
    });
  });
});

describe('stores actions', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('can fetch stores and fetch categories from user.store', async () => {
    const mockStore = makeStore();
    fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: 'ICA' }]));
    fetch.mockResponseOnce(
      JSON.stringify([{ id: 1, name: 'Dairy', orderidx: 1 }])
    );

    await mockStore.dispatch(fetchStores());
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    const actions = mockStore.getActions();
    expect(actions).toContainEqual({
      type: FETCH_STORES,
      stores: [{ id: 1, name: 'ICA' }],
    });
    expect(actions).toContainEqual({
      type: FETCH_CATEGORIES,
      categories: [{ id: 1, name: 'Dairy', orderidx: 1 }],
    });
  });

  it('can add a store', async () => {
    const mockStore = makeStore();
    fetch.mockResponseOnce(JSON.stringify({ id: 2, name: 'Coop' }));
    fetch.mockResponseOnce(
      JSON.stringify([
        { id: 1, name: 'ICA' },
        { id: 2, name: 'Coop' },
      ])
    );
    fetch.mockResponseOnce(JSON.stringify([]));
    fetch.mockResponseOnce(JSON.stringify([]));

    await mockStore.dispatch(addStore({ name: 'Coop' }));
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    expect(fetch.mock.calls[0][0]).toBe('/__/stores');
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ name: 'Coop' });
  });

  it('can switch active store', async () => {
    const mockStore = makeStore();
    fetch.mockResponseOnce(
      JSON.stringify([{ id: 1, name: 'Dairy', orderidx: 1 }])
    );

    await mockStore.dispatch(setActiveStore('ICA'));
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    expect(fetch.mock.calls[0][0]).toBe('/__/categories?storeId=1');
    expect(mockStore.getActions()).toContainEqual({
      type: UPDATE_USER,
      key: 'store',
      value: 'ICA',
    });
  });

  it('can remove a store', async () => {
    const mockStore = makeStore();
    fetch.mockResponseOnce('{}', { status: 204 });
    fetch.mockResponseOnce(JSON.stringify([]));

    await mockStore.dispatch(removeStore(1));
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    expect(fetch.mock.calls[0][0]).toBe('/__/stores/1');
    expect(fetch.mock.calls[0][1].method).toBe('DELETE');
  });
});
