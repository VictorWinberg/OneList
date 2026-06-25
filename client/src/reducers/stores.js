import { FETCH_STORES } from '../constants/stores';

const stores = (state = { list: [] }, action = {}) => {
  switch (action.type) {
    case FETCH_STORES:
      return { ...state, list: action.stores };
    default:
      return state;
  }
};

export default stores;
