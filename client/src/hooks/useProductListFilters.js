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

  const onRestockFilterToggle = useCallback(() => {
    setRestockFilter((prev) => {
      const next = !prev;
      if (next && (productRestockPredictions || []).length === 0) {
        dispatch(fetchStatistics());
      }
      return next;
    });
  }, [productRestockPredictions, dispatch]);

  const restockFilterDisabled = !isLoggedIn;

  return {
    filterProps: {
      ageFilter,
      sortOrder,
      onAgeChange: setAgeFilter,
      onSortChange: setSortOrder,
      restockFilter,
      onRestockFilterToggle,
      restockFilterDisabled,
    },
    listFilterProps: { ageFilter, sortOrder, restockFilter },
  };
};
