import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { getTranslate } from 'react-localize-redux';
import { find, get, toInteger } from 'lodash/fp';

import { editCategory, removeCategory } from '../../actions/categories';
import CategoryColors from './CategoryColors';

const EditCategory = ({
  id,
  category,
  translate,
  onRemove,
  onSubmit,
  history,
}) => (
  <div className="category">
    <div className="title">
      <b>{translate('edit.edit')}: </b>
      {category}
    </div>
    <div className="wrapper">
      <form onSubmit={evt => onSubmit(evt, id, history)}>
        <label htmlFor="categoryName">
          <span>{translate('edit.category')}:</span>
          <input
            id="categoryName"
            name="categoryName"
            autoComplete="off"
            defaultValue={category}
          />
        </label>
        <CategoryColors id={id} />
        <button
          className="deleteBtn"
          type="button"
          onClick={() => {
            onRemove(id);
            history.push('/categories');
          }}
        >
          {translate('edit.delete')}
        </button>
        <button
          className="cancelBtn"
          type="button"
          onClick={() => history.push('/categories')}
        >
          {translate('edit.cancel')}
        </button>
        <button className="doneBtn" type="submit">
          {translate('edit.save')}
        </button>
      </form>
    </div>
  </div>
);

EditCategory.defaultProps = {
  category: 'Uncategorized',
};

EditCategory.propTypes = {
  id: PropTypes.number.isRequired,
  category: PropTypes.string,
  translate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const handleSubmit = (event, id, history) => dispatch => {
  const data = new FormData(event.target);
  const [name, color] = ['categoryName', 'color'].map(type => data.get(type));

  dispatch(editCategory({ id, name, color }));
  event.preventDefault();
  history.push('/categories');
};

const mapStateToProps = (state, { match }) => {
  const id = toInteger(match.params.id);

  return {
    id,
    category: get('name', find({ id }, state.categories)),
    translate: getTranslate(state.locale),
  };
};

const mapDispatchToProps = {
  onSubmit: handleSubmit,
  onRemove: removeCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCategory);
