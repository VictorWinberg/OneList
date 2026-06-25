import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import makeStore from '../store';
import stores from '../../reducers/stores';
import {
  fetchStores,
  setActiveStore,
  addStore,
  removeStore,
} from '../../actions/stores';
import { FETCH_STORES, SET_ACTIVE_STORE } from '../../constants/stores';

describe('stores reducer', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('has a default state', () => {
    expect(stores(undefined, { type: 'unexpected' })).toEqual({
      list: [],
      activeStoreId: null,
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
      activeStoreId: null,
    });
  });

  it('can handle SET_ACTIVE_STORE', () => {
    expect(
      stores(undefined, { type: SET_ACTIVE_STORE, storeId: 2 })
    ).toEqual({
      list: [],
      activeStoreId: 2,
    });
  });
});

describe('stores actions', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('can fetch stores and set active store from user.store', async () => {
    const mockStore = configureStore([thunk])({
      user: { id: 1, store: 'ICA' },
      stores: { list: [], activeStoreId: null },
    });
    fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: 'ICA' }]));
    fetch.mockResponseOnce(
      JSON.stringify([{ id: 1, name: 'Dairy', orderidx: 1 }])
    );
    fetch.mockResponseOnce(JSON.stringify({ id: 1, store: 'ICA' }));

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
      type: SET_ACTIVE_STORE,
      storeId: 1,
    });
    expect(fetch.mock.calls.some(([url]) => url === '/__/user')).toBe(true);
  });

  it('can add a store', async () => {
    const mockStore = makeStore();
    fetch.mockResponseOnce(JSON.stringify({ id: 2, name: 'Coop' }));
    fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: 'ICA' }, { id: 2, name: 'Coop' }]));
    fetch.mockResponseOnce(JSON.stringify([]));
    fetch.mockResponseOnce(JSON.stringify([]));
    fetch.mockResponseOnce(JSON.stringify({ id: 1, store: 'Coop' }));

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
    fetch.mockResponseOnce(JSON.stringify({ id: 1, store: 'ICA' }));

    await mockStore.dispatch(setActiveStore(1));
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    expect(fetch.mock.calls[0][0]).toBe('/__/categories?storeId=1');
    expect(fetch.mock.calls[1][0]).toBe('/__/user');
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ store: 'ICA' });
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
