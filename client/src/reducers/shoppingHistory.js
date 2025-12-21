import { FETCH_STATISTICS } from '../constants/shoppingHistory';

const initialState = {
  totalPurchases: 0,
  purchaseFrequency: {
    itemsPerWeek: 0,
    itemsPerMonth: 0,
  },
  mostBoughtItems: [],
  monthlyPurchases: [],
  dateRange: {
    first: null,
    last: null,
  },
  loading: true,
};

const shoppingHistory = (state = initialState, action = {}) => {
  switch (action.type) {
    case FETCH_STATISTICS:
      return {
        ...state,
        ...action.statistics,
        loading: false,
      };
    default:
      return state;
  }
};

export default shoppingHistory;

