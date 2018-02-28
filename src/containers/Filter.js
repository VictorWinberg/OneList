import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import { setVisibilityFilter } from '../actions/todos';

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
