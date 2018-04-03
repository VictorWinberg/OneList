import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import setVisibilityFilter from '../actions/filter';

const button = ({ active, onClick, filter }) => (
  <button active={active} onClick={onClick}>
    {filter}
  </button>
);

button.propTypes = {
  active: PropTypes.bool.isRequired,
  filter: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.filter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(setVisibilityFilter(ownProps.filter));
  },
});

const Filter = connect(mapStateToProps, mapDispatchToProps)(button);

export default Filter;
