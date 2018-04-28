import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { get, find, map as fmap } from 'lodash/fp';

class CategorySelect extends Component {
  constructor(props) {
    super(props);

    this.state = { select: true };
  }

  render() {
    const { select } = this.state;
    const { category, categories, translate } = this.props;

    if (select) {
      return (
        <select
          id="categories"
          defaultValue={category}
          onChange={({ target }) =>
            this.setState({
              select: target.selectedIndex < target.options.length - 1,
            })
          }
        >
          <option value="">{translate('categories.uncategorized')}</option>
          {categories.map(c => <option key={c}>{c}</option>)}
          <option>{translate('categories.input')}</option>
        </select>
      );
    }

    return <input placeholder={translate('categories.input')} />;
  }
}

CategorySelect.defaultProps = {
  category: '',
};

CategorySelect.propTypes = {
  category: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  translate: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { id }) => ({
  category: get('category', find({ id }, state.products)),
  categories: fmap('text', state.categories),
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(CategorySelect);
