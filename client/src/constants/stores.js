export const FETCH_STORES = 'FETCH_STORES';
export const SET_ACTIVE_STORE = 'SET_ACTIVE_STORE';

export const ACTIVE_STORE_KEY = 'activeStoreId';

export const getInitialActiveStoreId = () => {
  const stored = localStorage.getItem(ACTIVE_STORE_KEY);
  return stored ? parseInt(stored, 10) : null;
};
