import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { find, get, getOr, maxBy, sortBy } from 'lodash/fp';

class CategorySelect extends Component {
  constructor(props) {
    super(props);

    this.state = { select: true };
  }

  render() {
    const { select } = this.state;
    const { category, categories, t } = this.props;

    return (
      <label htmlFor="category">
        <span>{t('edit.category')}:</span>
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
            <option value="0">{t('categories.uncategorized')}</option>
            {categories.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
            <option>{t('categories.input')}</option>
          </select>
        ) : (
          <div>
            <input
              id="category"
              name="newCategory"
              // eslint-disable-next-line
              autoFocus
              autoComplete="off"
              placeholder={t('categories.input')}
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

CategorySelect.propTypes = {
  category: PropTypes.number,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { id }) => ({
  category: get('category', find({ id }, state.products)) || 0,
  categories: sortBy('name', state.categories),
});

export default connect(mapStateToProps)(withTranslation()(CategorySelect));
