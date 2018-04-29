import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { getTranslate } from 'react-localize-redux';
import CategoryColors from '../products/CategoryColors';

const EditCategory = ({ category, translate }) => (
  <div className="category">
    <div className="title">
      <b>{translate('edit.edit')}: </b>
      {category}
    </div>
    <div className="wrapper">
      <form>
        <label htmlFor="categoryName">
          <span>{translate('edit.category')}:</span>
          <input id="categoryName" autoComplete="off" defaultValue={category} />
        </label>
        <label htmlFor="categories">
          <span>{translate('edit.color')}:</span>
          <CategoryColors/>
        </label>
        <button className="cancelBtn" type="submit" action="/">
          Avbryt
        </button>
        <button className="doneBtn" type="submit">
          Klar
        </button>
      </form>
    </div>
  </div>
);

EditCategory.defaultProps = {
  category: 'Uncategorized',
};

EditCategory.propTypes = {
  category: PropTypes.string,
  translate: PropTypes.func.isRequired,
};

const getCategory = (categories, id) => {
  const found = categories.filter(category => category.id === id);
  if (found.length > 0) {
    return found[0];
  }
  return {};
};

const mapStateToProps = (state, ownProps) => {
  const category = getCategory(
    state.categories,
    parseInt(ownProps.match.params.id, 10)
  );

  return {
    category: category.text,
    translate: getTranslate(state.locale),
  };
};

export default connect(mapStateToProps)(EditCategory);
