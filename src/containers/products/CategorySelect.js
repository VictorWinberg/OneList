import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { find, get, getOr, maxBy, sortBy } from 'lodash/fp';

class CategorySelect extends Component {
  constructor(props) {
    super(props);

    this.state = { select: true };
  }

  render() {
    const { select } = this.state;
    const { category, categories, translate } = this.props;

    return (
      <label htmlFor="category">
        <span>{translate('edit.category')}:</span>
        {select ? (
          <select
            id="category"
            name="category"
            defaultValue={category}
            onChange={({ target }) =>
              this.setState({
                select: target.selectedIndex < target.options.length - 1,
              })
            }
          >
            <option value="0">{translate('categories.uncategorized')}</option>
            {categories.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
            <option>{translate('categories.input')}</option>
          </select>
        ) : (
          <div>
            <input
              id="category"
              name="newCategory"
              // eslint-disable-next-line
              autoFocus
              autoComplete="off"
              placeholder={translate('categories.input')}
            />
            {/* TODO: get category last_inserted_id instead */}
            <input
              name="category"
              type="hidden"
              value={1 + getOr(0, 'id', maxBy('id', categories))}
            />
          </div>
        )}
      </label>
    );
  }
}

CategorySelect.defaultProps = {
  category: 0,
};

CategorySelect.propTypes = {
  category: PropTypes.number,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  translate: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { id }) => ({
  category: get('category', find({ id }, state.products)),
  categories: sortBy('name', state.categories),
  translate: getTranslate(state.locale),
});

export default connect(mapStateToProps)(CategorySelect);
