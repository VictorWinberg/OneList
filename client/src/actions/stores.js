import { FETCH_STORES, SET_ACTIVE_STORE, ACTIVE_STORE_KEY } from '../constants/stores';
import { fetchCategories } from './categories';

export const setActiveStore = (storeId) => async (dispatch) => {
  localStorage.setItem(ACTIVE_STORE_KEY, storeId);
  dispatch({ type: SET_ACTIVE_STORE, storeId });
  return dispatch(fetchCategories());
};

export const fetchStores = () => async (dispatch, getState) => {
  try {
    const res = await fetch('/__/stores', { credentials: 'include' });
    const stores = await res.json();
    dispatch({ type: FETCH_STORES, stores });

    const { activeStoreId } = getState().stores;
    const hasActive = stores.some(({ id }) => id === activeStoreId);
    const nextStoreId = hasActive ? activeStoreId : stores[0]?.id ?? null;

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
      await fetch('/__/stores', {
        method: 'POST',
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
      localStorage.removeItem(ACTIVE_STORE_KEY);
      dispatch({ type: SET_ACTIVE_STORE, storeId: null });
    }
    return dispatch(fetchStores());
  } catch (err) {
    console.error(err);
    return null;
  }
};
