import { connect } from 'react-redux';
import { flow, groupBy, mergeWith, filter, map, values } from 'lodash/fp';

import Autosuggest from '../../components/Autosuggest';

const getSuggestions = (value, db) => {
  const search = ({ name }) => name.match(new RegExp(value, 'i'));

  return flow(
    filter(search),
    groupBy('category'),
    mergeWith((category, products) => ({
      products: map('name', products),
      category: category.name,
    }))(db.categories),
    filter('products.length'),
    values
  )(db.products);
};

const mapStateToProps = state => ({
  getSuggestions: value => getSuggestions(value, state.db),
});

export default connect(mapStateToProps)(Autosuggest);
