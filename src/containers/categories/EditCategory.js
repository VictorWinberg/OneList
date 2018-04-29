import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { getTranslate } from 'react-localize-redux';

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
          <input id="categoryName" autoComplete="off" defaultValue="VÄLJ" readOnly/>
          <ul className="color-list">
            <li style={{ backgroundColor: '#ffc2b3'}}/>
            <li style={{ backgroundColor: '#ffb3b3'}}/>
            <li style={{ backgroundColor: '#ffb3d9'}}/>
            <li style={{ backgroundColor: '#f0c2e0'}}/>
            <li style={{ backgroundColor: '#ffb3ff'}}/>
            <li style={{ backgroundColor: '#d9b3ff'}}/>
            <li style={{ backgroundColor: '#c2c2f0'}}/>
            <li style={{ backgroundColor: '#b3b3ff'}}/>
            <li style={{ backgroundColor: '#b3d9ff'}}/>
            <li style={{ backgroundColor: '#b3e6ff'}}/>
            <li style={{ backgroundColor: '#b3ffff'}}/>
            <li style={{ backgroundColor: '#b3ffd9'}}/>
            <li style={{ backgroundColor: '#b3ffcc'}}/>
            <li style={{ backgroundColor: '#e6ffb3'}}/>
            <li style={{ backgroundColor: '#ffffb3'}}/>
            <li style={{ backgroundColor: '#ffe0b3'}}/>
          </ul>
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
