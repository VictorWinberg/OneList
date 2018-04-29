import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { get, find } from 'lodash/fp';
import { toInteger } from 'lodash/lang';

import { addCategory } from '../../actions/categories';
import { editProduct } from '../../actions/products';
import CategorySelect from './CategorySelect';

const handleSubmit = (event, id, history) => dispatch => {
  const data = new FormData(event.target);
  const [text, category, categories] = [
    'productName',
    'category',
    'categories',
  ].map(name => data.get(name));

  if (categories) dispatch(addCategory(categories));

  dispatch(editProduct({ id, text, category: category || categories }));
  event.preventDefault();
  history.push('/');
};

const EditProduct = ({ id, name, translate, onSubmit, history }) => (
  <div className="product">
    <div className="title">
      <b>{translate('edit.edit')}: </b>
      {name}
    </div>
    <div className="wrapper">
      <form onSubmit={evt => onSubmit(evt, id, history)}>
        <label htmlFor="productName">
          <span>{translate('edit.name')}:</span>
          <input
            id="productName"
            name="productName"
            autoComplete="off"
            defaultValue={name}
          />
        </label>
        <CategorySelect id={id} />
        <button
          className="cancelBtn"
          type="button"
          onClick={() => history.push('/')}
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

EditProduct.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { match }) => {
  const id = toInteger(match.params.id);

  return {
    id,
    name: get('text', find({ id }, state.products)),
    translate: getTranslate(state.locale),
  };
};

const mapDispatchToProps = {
  onSubmit: handleSubmit,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProduct);
