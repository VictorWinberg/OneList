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
  categoryDistribution: [],
  dayOfWeekStats: [],
  dayOfMonthStats: [],
  productTrends: [],
  monthComparison: {
    thisMonth: 0,
    lastMonth: 0,
    change: 0,
  },
  mostActiveDay: null,
  dailyPurchases: [],
  dateRange: {
    first: null,
    last: null,
  },
  frequencyDistribution: [],
  productFrequency: [],
  intervalTrend: [],
  hourOfDay: [],
  weeklyComparison: [],
  seasonalTrends: [],
  categoryFrequency: [],
  productLifecycle: [],
  purchaseVelocity: [],
  intervalsSummary: {},
  nextPurchasePrediction: {},
  productRestockPredictions: [],
  shoppingBaskets: [],
  purchaseClusters: [],
  purchaseAnomalies: [],
  shoppingEfficiency: {},
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
