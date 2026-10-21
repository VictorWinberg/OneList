import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchStatistics } from '../actions/history';

export const useProductListFilters = () => {
  const [ageFilter, setAgeFilter] = useState('1y');
  const [sortOrder, setSortOrder] = useState('nameAsc');
  const [restockFilter, setRestockFilter] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.user.email);
  const productRestockPredictions = useSelector(
    (state) => state.history.productRestockPredictions
  );

  const handleRestockFilterToggle = useCallback(() => {
    const next = !restockFilter;
    if (next && (productRestockPredictions || []).length === 0) {
      dispatch(fetchStatistics());
    }
    setRestockFilter(next);
  }, [restockFilter, productRestockPredictions, dispatch]);

  return {
    ageFilter,
    setAgeFilter,
    sortOrder,
    setSortOrder,
    restockFilter,
    onRestockFilterToggle: handleRestockFilterToggle,
    restockFilterDisabled: !isLoggedIn,
  };
};
