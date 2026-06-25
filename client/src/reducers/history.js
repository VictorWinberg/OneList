import { FETCH_STATISTICS } from '../constants/history';

const initialState = {
  totalPurchases: 0,
  uniqueProducts: 0,
  purchaseFrequency: {
    itemsPerWeek: 0,
    itemsPerMonth: 0,
  },
  mostBoughtItems: [],
  monthlyPurchases: [],
  dayOfWeekStats: [],
  dayOfMonthStats: [],
  monthComparison: {
    thisMonth: 0,
    lastMonth: 0,
    change: 0,
  },
  mostActiveDay: null,
  dateRange: {
    first: null,
    last: null,
  },
  productFrequency: [],
  hourOfDay: [],
  weeklyComparison: [],
  seasonalTrends: [],
  purchaseVelocity: [],
  productRestockPredictions: [],
  loading: true,
};

const history = (state = initialState, action = {}) => {
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

export default history;
