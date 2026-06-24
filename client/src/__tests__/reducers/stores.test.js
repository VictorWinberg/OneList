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
    localStorage.clear();
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
    localStorage.clear();
  });

  it('can fetch stores and set active store', async () => {
    const mockStore = configureStore([thunk])({
      stores: { list: [], activeStoreId: null },
    });
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
      type: SET_ACTIVE_STORE,
      storeId: 1,
    });
    expect(localStorage.getItem('activeStoreId')).toBe('1');
  });

  it('can add a store', async () => {
    const mockStore = makeStore();
    fetch.mockResponseOnce('{}', { status: 200 });
    fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: 'Coop' }]));
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

    await mockStore.dispatch(setActiveStore(1));
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    expect(fetch.mock.calls[0][0]).toBe('/__/categories?storeId=1');
    expect(localStorage.getItem('activeStoreId')).toBe('1');
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
