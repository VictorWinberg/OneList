import { FETCH_STORES } from '../constants/stores';
import { UPDATE_USER } from '../constants/user';
import { fetchCategories } from './categories';

export const setActiveStore = (storeName) => async (dispatch) => {
  dispatch({ type: UPDATE_USER, key: 'store', value: storeName });
  return dispatch(fetchCategories());
};

export const fetchStores = () => async (dispatch, getState) => {
  try {
    const res = await fetch('/__/stores', { credentials: 'include' });
    const stores = await res.json();
    dispatch({ type: FETCH_STORES, stores });

    const storeName = getState().user.store;
    if (!storeName) return null;

    if (!stores.some((store) => store.name === storeName)) {
      dispatch({ type: UPDATE_USER, key: 'store', value: null });
      return null;
    }

    return dispatch(fetchCategories());
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
      if (store?.name) {
        return dispatch(setActiveStore(store.name));
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };
