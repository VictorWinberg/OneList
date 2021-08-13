import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import {
  filter,
  find,
  flow,
  get,
  getOr,
  groupBy,
  map,
  mergeWith,
  sortBy,
  toInteger,
  uniqBy,
  zipObject,
} from 'lodash/fp';

import Autosuggest from '../../components/Autosuggest';

// TODO: Move some of this logic to a helpers function

const getSuggestions = (value, state) => {
  const search = ({ name }) => name.match(new RegExp(value, 'i'));

  const uncategorized = getTranslate(state.locale)('categories.uncategorized');
  const getCategory = ({ category }) =>
    get('name', find({ id: toInteger(category) }, state.categories));

  return flow(
    uniqBy('id'),
    filter(search),
    map(product => ({
      ...product,
      uid: state.user.isCollaboration ? 0 : state.user.id || 0,
      categoryName: getCategory(product),
    })),
    sortBy(({ name, uid }) => [name.toLowerCase(), uid]),
    groupBy('categoryName'),
    mergeWith((category, products) => ({
      title: getOr(uncategorized, 'name', category),
      suggestions: products,
    }))(zipObject(map('name', state.categories), state.categories)),
    filter('suggestions.length'),
    sortBy('orderidx')
  )(state.products);
};

const mapStateToProps = state => ({
  getSuggestions: value => getSuggestions(value, state),
});

export default connect(mapStateToProps)(Autosuggest);
