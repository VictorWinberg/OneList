import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

const AGE_OPTIONS = [
  ['all', null, 'all'],
  ['1d', 1, 'day'],
  ['7d', 1, 'week'],
  ['30d', 30, 'days'],
  ['3m', 3, 'months'],
  ['6m', 6, 'months'],
  ['1y', 1, 'year'],
];

const SORT_OPTIONS = ['nameAsc', 'nameDesc', 'dateDesc', 'dateAsc'];

const Filter = ({ translate, ageFilter, sortOrder, onAgeChange, onSortChange }) => (
  <div className="filter-control">
    <label htmlFor="ageFilter">{translate('filter.ageFilterLabel')}</label>
    <select id="ageFilter" value={ageFilter} onChange={(e) => onAgeChange(e.target.value)}>
      {AGE_OPTIONS.map(([value, count, unitKey]) => (
        <option key={value} value={value}>
          {`${count || ''} ${translate(`filter.ageUnits.${unitKey}`)}`}
        </option>
      ))}
    </select>

    <label htmlFor="sortOrder">{translate('filter.sortOrderLabel')}</label>
    <select id="sortOrder" value={sortOrder} onChange={(e) => onSortChange(e.target.value)}>
      {SORT_OPTIONS.map((value) => (
        <option key={value} value={value}>
          {translate(`filter.sortOptions.${value}`)}
        </option>
      ))}
    </select>
  </div>
);

Filter.propTypes = {
  translate: PropTypes.func.isRequired,
  ageFilter: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onAgeChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(Filter);
