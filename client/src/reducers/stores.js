import {
  FETCH_STORES,
  SET_ACTIVE_STORE,
  getInitialActiveStoreId,
} from '../constants/stores';

const stores = (
  state = { list: [], activeStoreId: getInitialActiveStoreId() },
  action = {}
) => {
  switch (action.type) {
    case FETCH_STORES:
      return { ...state, list: action.stores };
    case SET_ACTIVE_STORE:
      return { ...state, activeStoreId: action.storeId };
    default:
      return state;
  }
};

export default stores;
