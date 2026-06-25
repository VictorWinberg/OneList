import { FETCH_STORES, SET_ACTIVE_STORE } from '../constants/stores';
import { fetchCategories } from './categories';
import { persistUserStore } from './user';

const resolveActiveStoreId = (stores, getState) => {
  const { activeStoreId } = getState().stores;
  const { store: userStoreName } = getState().user;

  if (userStoreName) {
    const match = stores.find(({ name }) => name === userStoreName);
    if (match) return match.id;
  }

  const hasActive = stores.some(({ id }) => id === activeStoreId);
  if (hasActive) return activeStoreId;

  return stores[0]?.id ?? null;
};

export const setActiveStore = (storeId) => async (dispatch, getState) => {
  const store = getState().stores.list.find(({ id }) => id === storeId);
  dispatch({ type: SET_ACTIVE_STORE, storeId });
  await dispatch(fetchCategories());
  if (store?.name) {
    return dispatch(persistUserStore(store.name));
  }
  return dispatch(persistUserStore(null));
};

export const fetchStores = () => async (dispatch, getState) => {
  try {
    const res = await fetch('/__/stores', { credentials: 'include' });
    const stores = await res.json();
    dispatch({ type: FETCH_STORES, stores });

    const { activeStoreId } = getState().stores;
    const nextStoreId = resolveActiveStoreId(stores, getState);

    if (nextStoreId && nextStoreId !== activeStoreId) {
      return dispatch(setActiveStore(nextStoreId));
    }
    if (nextStoreId) {
      return dispatch(fetchCategories());
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const addStore =
  ({ name }) =>
  async (dispatch) => {
    if (!name) return null;
    try {
      const res = await fetch('/__/stores', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });
      const store = await res.json();
      await dispatch(fetchStores());
      if (store?.id) {
        return dispatch(setActiveStore(store.id));
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

export const editStore =
  ({ id, name }) =>
  async (dispatch) => {
    try {
      await fetch(`/__/stores/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });
      return dispatch(fetchStores());
    } catch (err) {
      console.error(err);
      return null;
    }
  };

export const removeStore = (id) => async (dispatch, getState) => {
  try {
    await fetch(`/__/stores/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const { activeStoreId } = getState().stores;
    if (activeStoreId === id) {
      dispatch({ type: SET_ACTIVE_STORE, storeId: null });
    }
    return dispatch(fetchStores());
  } catch (err) {
    console.error(err);
    return null;
  }
};
