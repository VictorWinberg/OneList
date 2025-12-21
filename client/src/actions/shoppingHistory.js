import { FETCH_STATISTICS } from '../constants/shoppingHistory';

export const fetchStatistics = () => async (dispatch) => {
  try {
    const res = await fetch('/__/shopping-history/stats', {
      credentials: 'include',
    });
    const statistics = await res.json();
    return dispatch({ type: FETCH_STATISTICS, statistics });
  } catch (err) {
    console.error(err);
    return null;
  }
};
