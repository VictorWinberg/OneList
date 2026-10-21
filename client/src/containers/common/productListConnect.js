import { selectRestockProductNames } from '../../selectors/history';

export const mapProductListCommonState = (state, ownProps) => ({
  checked: [],
  linkTo: (id) => `/products/${id}`,
  getData: (item) => ({
    ...item,
    userId: state.user.isCollaboration ? 0 : state.user.id || 0,
  }),
  ageFilter: ownProps.ageFilter,
  sortOrder: ownProps.sortOrder,
  restockFilter: ownProps.restockFilter,
  restockProductNames: selectRestockProductNames(state),
});
