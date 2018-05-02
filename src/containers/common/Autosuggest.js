import { connect } from 'react-redux';
import {
  flow,
  mergeWith,
  groupBy,
  filter,
  map,
  zipObject,
  getOr,
  values,
} from 'lodash/fp';
import { getTranslate } from 'react-localize-redux';

import Autosuggest from '../../components/Autosuggest';

const getSuggestions = (value, state) => {
  const search = ({ name }) => name.match(new RegExp(value, 'i'));

  const uncategorized = getTranslate(state.locale)('categories.uncategorized');

  return flow(
    filter(search),
    groupBy('category'),
    mergeWith((category, products) => ({
      title: getOr(uncategorized, 'name', category),
      suggestions: map('name', products),
    }))(zipObject(map('id', state.categories), state.categories)),
    filter('suggestions.length'),
    values
  )(state.products);
};

const mapStateToProps = state => ({
  getSuggestions: value => getSuggestions(value, state),
});

export default connect(mapStateToProps)(Autosuggest);
