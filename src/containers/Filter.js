import { connect } from 'react-redux';

import Button from '../components/Button';
import setVisibilityFilter from '../actions/filter';

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.filter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(setVisibilityFilter(ownProps.filter));
  },
});

const Filter = connect(mapStateToProps, mapDispatchToProps)(Button);

export default Filter;
