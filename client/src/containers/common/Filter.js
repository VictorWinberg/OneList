import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import repeatIcon from '../../assets/icons/repeat.svg';

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

const Filter = ({
  ageFilter,
  sortOrder,
  onAgeChange,
  onSortChange,
  restockFilter,
  onRestockFilterToggle,
  restockFilterDisabled = false,
}) => {
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

      <button
        type="button"
        className={`filter-restock-toggle${
          restockFilter ? ' filter-restock-toggle--active' : ''
        }`}
        aria-pressed={restockFilter}
        aria-label={t('filter.restockPredictions')}
        disabled={restockFilterDisabled}
        title={
          restockFilterDisabled
            ? t('filter.restockPredictionsLoginRequired')
            : t('history.productRestockPredictionsDesc')
        }
        onClick={onRestockFilterToggle}
      >
        <img
          className="filter-restock-toggle__icon"
          src={repeatIcon}
          alt=""
          width={20}
          height={20}
        />
      </button>
    </div>
  );
};

Filter.propTypes = {
  ageFilter: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onAgeChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  restockFilter: PropTypes.bool.isRequired,
  onRestockFilterToggle: PropTypes.func.isRequired,
  restockFilterDisabled: PropTypes.bool,
};

export default Filter;
