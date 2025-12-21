import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

const AGE_OPTIONS = [
  ['all', null, 'all'],
  ['1d', 1, 'day'],
  ['1w', 1, 'week'],
  ['1m', 1, 'month'],
  ['3m', 3, 'months'],
  ['6m', 6, 'months'],
  ['1y', 1, 'year'],
];

const SORT_OPTIONS = ['nameAsc', 'nameDesc', 'dateDesc', 'dateAsc'];

const Filter = ({ ageFilter, sortOrder, onAgeChange, onSortChange }) => {
  const { t } = useTranslation();

  return (
    <div className="filter-control">
      <label htmlFor="ageFilter">{t('filter.ageFilterLabel')}</label>
      <select
        id="ageFilter"
        value={ageFilter}
        onChange={(e) => onAgeChange(e.target.value)}
      >
        {AGE_OPTIONS.map(([value, count, unitKey]) => (
          <option key={value} value={value}>
            {`${count || ''} ${t(`filter.ageUnits.${unitKey}`)}`}
          </option>
        ))}
      </select>

      <label htmlFor="sortOrder">{t('filter.sortOrderLabel')}</label>
      <select
        id="sortOrder"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {SORT_OPTIONS.map((value) => (
          <option key={value} value={value}>
            {t(`filter.sortOptions.${value}`)}
          </option>
        ))}
      </select>
    </div>
  );
};

Filter.propTypes = {
  ageFilter: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onAgeChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default connect()(Filter);
